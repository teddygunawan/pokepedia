<template>
  <section>
    <!-- TBD - IMPLEMENT VIRTUAL SCROLLING FOR FASTER UI -->
    <keep-alive>
      <div class="columns is-multiline is-mobile">
        <div
          class="column is-variable is-12-mobile is-6-tablet is-4-desktop is-3-fullhd"
          v-for="(pokemon, index) in pokemonList"
          :key="pokemon.id"
        >
          <base-pokemon-card :pokemon="pokemon">
            <template v-slot:ownedCount>
              Owned: {{ userPokemonList[index] ? userPokemonList[index].length : 0 }}
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
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState('pokemons', ['pokemonList', 'pokemonCount', 'pokemonEachRequest']),
    ...mapState('user', {
      userPokemonList: 'pokemonList'
    })
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
      this.isLoading = true
      await this.$store.dispatch('pokemons/fetchManyPokemons')
      this.isLoading = false
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
  margin-top: 10vh;
  height: 20vh;
  width: 100%;
  position: relative;
}
.loading-icon {
  font-size: 2em;
}
</style>
