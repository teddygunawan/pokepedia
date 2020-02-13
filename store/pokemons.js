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
  getPokemon(state, id){
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
    state.pokemonList[id][key] = details
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
    /* Don't fetch the pokemon moves again if it already exist */
    if(state.pokemonList[id].moves){
      return
    }
    try {
      var response = await this.$axios.get(state.apiUri.pokemon + id)
    } catch (error) {
      // TBD - HANDLE POSSIBLE ERRORS
      console.log(error)
      return error
    }
    let moveList = []
    response.data.moves.forEach(async function ({ move, version_group_details }) {
      try {
        let response = await this.$axios.get(move.url)

        /* Retrieve only the necessary data keys based on state.dataKeys */
        let filteredData = Object.fromEntries(
          Object.entries(response.data).filter(([key]) => state.dataKeys.move.includes(key))
        )

        // Process extra columns
        let pokemonMove = filteredData
        pokemonMove['level_requirement'] = version_group_details[0].level_learned_at
        pokemonMove['type'] = pokemonMove['type'].name
        pokemonMove['damage_class'] = pokemonMove['damage_class'].name
        moveList.push(pokemonMove)
      } catch (error) {
        /* TBD -- HANDLE THE POSSIBLE ERRORS */
        console.log(error)
        return error
      }
    }, this)
    commit('ADD_POKEMON_DETAILS', { id: id, key: 'moves', details: moveList })
  },
  async fetchPokemonSpecies({ state, dispatch, commit }, id) {

  },
  async fetchPokemonDetails({ state, dispatch, commit }, id) {
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
    if ("moves" in state.pokemonList[id] == false) {
      await dispatch('fetchPokemonMoves', id)
    }

    commit('TOGGLE_LOADING', false)
    return state.pokemonList[id]
  },
  async fetchManyPokemons({ state, dispatch, commit }) {
    commit('TOGGLE_LOADING', true)
    /* Make multiple parallel pokemonRequests and synchronise the http result data before comitting it to pokemonList */
    /* TBD - COMMIT EACH DATA INDIVIDUALLY ON PRODUCTION */
    try {
      let startId = state.pokemonCount + 1
      let endId = state.pokemonCount + state.pokemonEachRequest
      let requestList = async function () {
        let pokemonData = {}
        for (let id = startId; id <= endId; id++) {
          try {
            let response = await dispatch('pokemonRequests', id)
            pokemonData[response.id] = response
          } catch (error) {
            console.log(error)
            return pokemonData
          }
        }
        return pokemonData
      }
      let responseData = await requestList()
      commit('APPEND_POKEMONS', responseData)
    } catch (error) {
      // TBD - HANDLE POSSIBLE ERRORS
      console.log(error)
    }
    commit('TOGGLE_LOADING', false)

  },
  /* Create http requests to the /pokemons API */
  async pokemonRequests({ state }, id) {
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