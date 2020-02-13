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
              <a href="#" class="has-text-danger">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </a>
            </template>
          </base-pokemon-card>
        </div>
      </div>
    </keep-alive>
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
    ...mapState('pokemons', ['pokemonList', 'pokemonCount']),
    ...mapState('user', {
      userPokemonList: 'pokemonList'
    }),
    pokemonDisplay() {
      let pokemonToDisplay = []
      /* TBD - THIS IS A PERFORMANCE PROBLEM, TRY TO FIND ANOTHER WAY TO DO IT */
      for (let id in this.userPokemonList) {
        for (let i = 0; i < this.userPokemonList[id].length; i++) {
          if (!this.pokemonList[id]) {
            this.$store.dispatch('pokemons/fetchPokemonDetails', id)
          }

          let pokemon = {
            ...this.pokemonList[id],
            ...this.userPokemonList[id][i]
          }
          pokemon.name = pokemon.nickName
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
    releasePokemon() {
      this.$store.dispatch('user/release')
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

<style
