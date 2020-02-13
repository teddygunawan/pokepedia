<template>
  <section class="section">
    <h3 class="title is-3">PokePedia</h3>
    <!-- TBD (POKESEARCH) - EXTEND THE SEARCH TO API IF POKEMON DOESN'T EXIST IN STORE! -->
    <b-field label="Find a Pokemon to Catch!">
      <b-autocomplete
        v-model="pokemonSearch"
        :data="pokemonNameSearch"
        placeholder="e.g. Bulbasaur"
        icon="magnify"
        @select="option => (selectedPokemon = option)"
      >
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <pokemon-list />
  </section>
</template>
<script>
import PokemonList from '~/components/pokemons/PokemonList'
import { mapGetters } from 'vuex'
export default {
  components: {
    PokemonList
  },
  data() {
    return {
      pokemonSearch: '',
      selectedPokemon: null
    }
  },
  computed: {
    ...mapGetters('pokemons', ['pokemonNameList']),
    /* TBD (POKESEARCH) - MIGHT NEED TO OPTIMIZE IT! */
    pokemonNameSearch() {
      if (this.pokemonNameList.length > 0) {
        return this.pokemonNameList.filter(option => {
          return (
            option
              .toString()
              .toLowerCase()
              .indexOf(this.pokemonSearch.toLowerCase()) >= 0
          )
        })
      }
    }
  }
}
</script>
