<template>
  <section>
    <!-- TBD - TRY TO SOMEHOW TO MAKE THIS REUSABLE BETWEEN POKEMON LIST AND USERPOKEMONLIST -->
    <keep-alive>
      <div class="columns is-multiline is-mobile">
        <div
          class="column is-variable is-12-mobile is-6-tablet is-4-desktop is-3-fullhd"
          v-for="(pokemon, index) in pokemonList"
          :key="pokemon.id"
        >
          <base-pokemon-card :pokemon="pokemon">
            <template v-slot:ownedCount>
              {{ userPokemonList[index] ? userPokemonList[index].length : 0 }}
            </template>
          </base-pokemon-card>
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
  props: {
    pokemonList: { required: true },
    pokemonEachRequest: { required: true },
    pokemonCount: { required: true },
    userPokemonList: { required: true },
    isLoading: { required: true },
    getNextPokemons:{required:true}
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
