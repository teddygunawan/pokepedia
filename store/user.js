export const state = () => ({
  isLoggedIn: false,
  pokemonList: {}
})
export const getters = {

}

export const mutations = {
  LOGIN(state) {

  },
  LOGOUT(state) {

  },
  ADD_CAPTURED_POKEMON(state, pokemon) {
    if (!(pokemon.id in state.pokemonList)) {
      state.pokemonList[pokemon.id] = []
    }
    state.pokemonList[pokemon.id].push(pokemon)
    localStorage.userPokemon = JSON.stringify(state.pokemonList)
  },
  /* TBD - MIGHT WANT TO CONSIDER USING OTHER KEYS INSTEAD OF timeCaptured */
  REMOVE_CAPTURED_POKEMON(state, { id, timeCaptured }) {
    let index = state.pokemonList[id].find(pokemon => { 
      return pokemon.timeCaptured == timeCaptured
    })

    state.pokemonList[id].splice(index, 1)
    localStorage.userPokemon = JSON.stringify(state.pokemonList)
  },
  REPLACE_POKEMONS(state, pokemonList) {
    state.pokemonList = pokemonList
    state.isLocalData = true
  }
}

export const actions = {
  addCapturedPokemon({ commit }, pokemon) {
    commit('ADD_CAPTURED_POKEMON', pokemon)
  },
  /* TBD (BACKEND) - ADD SUPPORT TO FETCH DATA FROM BACKEND */
  preloadData({ commit }) {
    if (localStorage.userPokemon) {
      commit('REPLACE_POKEMONS', JSON.parse(localStorage.userPokemon))
    }
  },
  releasePokemon({ commit }, pokemonToRelease) {
    commit('REMOVE_CAPTURED_POKEMON', pokemonToRelease)
  }
}