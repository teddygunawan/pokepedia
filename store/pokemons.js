export const state = () => ({
  pokemonList: {},
  pokemonCount: 0,
  pokemonEachRequest: 12,
  apiUri: {
    pokemon: 'https://pokeapi.co/api/v2/pokemon/',
    pokemonImg: 'https://pokeres.bastionbot.org/images/pokemon/',
    pokemonSpecies: 'https://pokeapi.co/api/v2/pokemon-species/',
    move: 'https://pokeapi.co/api/v2/move/'
  },
  dataKeys: {
    pokemon: [
      'abilities',
      'base_experience',
      'height',
      'id',
      'location_area_encounters',
      'name',
      'stats',
      'types',
      'weight'
    ],
    move: ['name', 'power', 'pp', 'type', 'damage_class', 'accuracy']
  },
  isOverquota: false,
  isLoading: false
})

export const getters = {
  pokemonNameList(state) {
    let nameList = []
    for (let key in state.pokemonList) {
      nameList.push(state.pokemonList[key].name)
    }

    return nameList
  },
  getPokemon(state, id) {
    return state.pokemonList[id]
  }
}

export const mutations = {
  ADD_POKEMON(state, pokemon) {
    /* Doesn't increment pokemonCount as it will mess up the pokemon batch fetches */
    let newPokemon = {}
    newPokemon[pokemon.id] = pokemon
    state.pokemonList = Object.assign({}, state.pokemonList, newPokemon)
  },
  ADD_POKEMON_DETAILS(state, { id, key, details }) {
    state.pokemonList[id] = Object.assign({}, state.pokemonList[id], {[key]: details})
    console.log(state.pokemonList[id])
  },
  APPEND_POKEMONS(state, pokemonList) {
    state.pokemonList = Object.assign({}, state.pokemonList, pokemonList)
    state.pokemonCount += Object.keys(pokemonList).length;
  },
  REPLACE_POKEMONS(state, pokemonList) {
    state.pokemonList = pokemonList
    state.isLocalData = true
  },
  TOGGLE_OVERQUOTA(state, overquotaStatus) {
    state.isOverquota = overquotaStatus
  },
  TOGGLE_LOADING(state, isLoadingStatus) {
    state.isLoading = isLoadingStatus
  }
}

export const actions = {
  async fetchPokemonMoves({ state, commit }, id) {
    try {
      var response = await this.$axios.get(state.apiUri.pokemon + id)
    } catch (error) {
      // TBD - HANDLE POSSIBLE ERRORS
      console.log(error)
      return error
    }
    let requestList = []
    let responseMoves = response.data.moves
    let movesLength = responseMoves.length
    let axios = this.$axios
    for (let i = 0; i < movesLength; i++) {
      requestList.push(responseMoves[i])
    }

    Promise.all(requestList.map(async function ({move, version_group_details}) {
      try {
        let response = await axios.get(move.url)
        let filteredData = Object.fromEntries(
          Object.entries(response.data).filter(([key]) => state.dataKeys.move.includes(key))
        )
        
        // Process extra columns
        let pokemonMove = filteredData
        pokemonMove['level_requirement'] = version_group_details[0].level_learned_at
        pokemonMove['type'] = pokemonMove['type'].name
        pokemonMove['damage_class'] = pokemonMove['damage_class'].name
        return pokemonMove
      } catch (error) {
        console.log(error)
        return error
      }

    }))
      .then(function (moveList) {
        console.log(moveList)
        commit('ADD_POKEMON_DETAILS', { id: id, key: 'moves', details: moveList })
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  async fetchPokemonSpecies({ state, dispatch, commit }, id) {

  },
  async fetchPokemon({ state, dispatch, commit }, { id, detailed }) {
    commit('TOGGLE_LOADING', true)
    if (!state.pokemonList[id]) {
      try {
        let responseData = await dispatch('pokemonRequests', id)
        commit('ADD_POKEMON', responseData)
      } catch (error) {
        // TBD - HANDLE POSSIBLE ERRORS
        console.log(error)
      }
    }

    /* If the fetch require the detailed pokemon informations (e.g. moves, species, description) */
    if (detailed) {
      if ("moves" in state.pokemonList[id] == false) {
        dispatch('fetchPokemonMoves', id)
      }
    }
    commit('TOGGLE_LOADING', false)
    return state.pokemonList[id]
  },
  /* Make multiple parallel pokemonRequests and synchronise the http result data before comitting it to pokemonList */
  async fetchManyPokemons({ state, dispatch, commit }) {
    commit('TOGGLE_LOADING', true)
    /* TBD - COMMIT EACH DATA INDIVIDUALLY ON PRODUCTION */
    let startId = state.pokemonCount + 1
    let endId = state.pokemonCount + state.pokemonEachRequest
    let requestList = []
    for (let id = startId; id <= endId; id++) {
      requestList.push(dispatch('pokemonRequests', id))
    }
    Promise.all(requestList)
      .then(function (responseData) {
        /* Group the data by id before comitting */
        let pokemonData = {}
        responseData.forEach(response => {
          pokemonData[response.id] = response
        })
        /* Commit the data and remove loading state */
        commit('APPEND_POKEMONS', pokemonData)
        commit('TOGGLE_LOADING', false)
      })
      .catch(function (error) {
        // TBD - HANDLE POSSIBLE ERRORS
        console.log(error)
      })
  },
  /* Create http requests to the /pokemons API */
  async pokemonRequests({ state, commit }, id) {
    try {
      let response = await this.$axios.get(state.apiUri.pokemon + id)

      /* Retrieve only the necessary data keys based on state.dataKeys */
      let filteredData = Object.fromEntries(
        Object.entries(response.data).filter(([key]) => state.dataKeys.pokemon.includes(key))
      )
      let pokemon = {
        ...filteredData,
        image: state.apiUri.pokemonImg + id + '.png'
      }
      return pokemon
    } catch (error) {
      // TBD - HANDLE POSSIBLE ERRORS
      console.log(error)
      return error
    }
  }
}