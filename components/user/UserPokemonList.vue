<template>
  <section>
    <!-- TBD - IMPLEMENT VIRTUAL SCROLLING FOR FASTER UI -->
    <template v-if="pokemonDisplay.length == 0">
      There is nothing here.... Go out and catch some!
    </template>
    <keep-alive>
      <div class="columns is-multiline is-mobile">
        <div
          class="column is-variable is-12-mobile is-6-tablet is-4-desktop is-3-fullhd"
          v-for="pokemon in pokemonDisplay"
          :key="pokemon.timeCaptured"
        >
          <base-pokemon-card :pokemon="pokemon">
            <template v-slot:options>
              <a
                href="#"
                class="has-text-danger"
                @click="releasePokemon(pokemon.id, pokemon.timeCaptured)"
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </a>
            </template>
          </base-pokemon-card>
        </div>
      </div>
    </keep-alive>
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    <!-- TBD - SCROLL FETCH LOADING ANIMATION  -->
    <!-- <div class="loading-container">
      <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    </div> -->
  </section>
</template>
<script>
import { mapState } from 'vuex'
import BasePokemonCard from '~/components/pokemons/BasePokemonCard'
export default {
  components: {
    BasePokemonCard
  },
  data() {
    return {
      shownPokemonCount: 12,
      pokemonPerView: 12
    }
  },
  computed: {
    ...mapState('pokemons', ['pokemonList', 'pokemonCount', 'isLoading']),
    ...mapState('user', {
      userPokemonList: 'pokemonList'
    }),
    pokemonDisplay() {
      let pokemonToDisplay = []
      /* TBD - THIS IS A PERFORMANCE PROBLEM, TRY TO FIND ANOTHER WAY TO DO IT */
      for (let id in this.userPokemonList) {
        for (let i = 0; i < this.userPokemonList[id].length; i++) {
          if (!this.pokemonList[id]) {
            this.$store.dispatch('pokemons/fetchPokemon', {id: id, detailed: false})
          }

          let pokemon = {
            ...this.userPokemonList[id][i],
            ...this.pokemonList[id]
          }
          pokemon.name = this.userPokemonList[id][i].nickName
          pokemonToDisplay.push(pokemon)
        }
      }
      return pokemonToDisplay
    }
  },
  methods: {
    /* Fetch more pokemons when user scroll to the bottom of the page */
    updateOnScroll() {
      let bottomOfWindow =
        window.innerHeight + Math.ceil(window.pageYOffset) >= document.body.offsetHeight
      if (bottomOfWindow && !this.isLoading) {
        this.shownPokemonCount
      }
    },
    releasePokemon(id, timeCaptured) {
      let pokemonToRelease = { id: id, timeCaptured: timeCaptured }
      console.log(pokemonToRelease)
      this.$store.dispatch('user/releasePokemon', pokemonToRelease)
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
