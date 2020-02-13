<template>
  <section>
    <keep-alive>
      <div class="columns is-multiline">
        <div
          class="column is-variable is-12-mobile is-6-tablet is-4-desktop is-3-fullhd"
          v-for="pokemon in pokemonList"
          :key="pokemon.id"
        >
          <base-pokemon-card :pokemon="pokemon" />
        </div>
      </div>
    </keep-alive>
    <div class="loading-container">
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import BasePokemonCard from '~/components/pokemons/BasePokemonCard'

export default {
  components: {
    BasePokemonCard
  },
  /* Load the pokemon list either from local storage if it exists, or from the API */
  data() {
    return {}
  },
  computed: {
    ...mapState('pokemons', ['pokemonList', 'pokemonCount', 'isLoading', 'pokemonEachRequest'])
  },
  created() {
    if (this.pokemonCount < this.pokemonEachRequest) this.getNextPokemons()
  },
  methods: {
    /* Fetch more pokemons when user scroll to the bottom of the page */
    updateOnScroll() {
      let bottomOfWindow =
        window.innerHeight + Math.ceil(window.pageYOffset) >= document.body.offsetHeight
      if (bottomOfWindow && !this.isLoading) {
        this.getNextPokemons()
      }
    },
    async getNextPokemons() {
      await this.$store.dispatch('pokemons/fetchManyPokemons')
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateOnScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateOnScroll)
  }
}
</script>

<style scoped>
.loading-container {
  height: 20vh;
  width: 100%;
  position: relative;
}
</style>
