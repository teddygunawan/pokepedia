<template>
  <section class="section">
    <!-- <b-tabs v-model="activeTab">
      <template v-for="(tab, index) in tabs">
        <b-tab-item v-if="tab.displayed" :key="index" :label="tab.label">
          {{ tab.content }}
        </b-tab-item>
      </template>
    </b-tabs>

    <b-tabs>
      <template v-for="(tab, index) in tabs"> </template>
    </b-tabs> -->

    <template v-if="pokemon && !isNotFound">
      <div class="columns">
        <div class="column is-4 has-text-centered-touch">
          <img :src="pokemon.image" class="" />
        </div>
        <div class="has-text-centered is-invisible-desktop">
          <b-button type="is-danger" size="is-large" @click="capturePokemon" outlined>
            <i class="far fa-dot-circle"></i> Capture!
          </b-button>
        </div>
        <div class="column is-4 is-paddingless">
          <pokemon-features :pokemon="pokemon" />

          <div class="has-text-centered is-invisible-touch">
            <b-button type="is-danger" size="is-large" @click="capturePokemon" outlined>
              <i class="far fa-dot-circle"></i> Capture!
            </b-button>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-three-quarters">
          <pokemon-stats :pokemonStats="pokemon.stats" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-three-quarters">
          <base-pokemon-moves :pokemonMoves="pokemon.moves" :isLoading="isLoading.moves" />
        </div>
      </div>
    </template>
    <b-loading :active.sync="isLoading.pokemon" :can-cancel="false"></b-loading>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import PokemonStats from '~/components/pokemons/PokemonStats'
import PokemonFeatures from '~/components/pokemons/PokemonFeatures'
import BasePokemonMoves from '~/components/pokemons/BasePokemonMoves'
import PokemonCapture from '~/components/pokemons/PokemonCapture'
export default {
  components: {
    PokemonStats,
    PokemonFeatures,
    BasePokemonMoves,
    PokemonCapture
  },
  middleware: '',
  data() {
    return {
      pokemonId: this.$route.params.id,
      description: '',
      isNotFound: false,
      isLoading: {
        pokemon: false,
        moves: false
      }
    }
  },
  async created() {
    /* TBD - GET THE DESCRIPTION OF THE POKEMON. BELOW IS THE CODE */
    if (!this.pokemon) {
      await this.getPokemon()
      this.getPokemonMoves()
    }else{
      if(!this.pokemon.moves){
        this.getPokemonMoves()
      }
    }

    // let temp = await this.$axios.get('https://pokeapi.co/api/v2/pokemon-species/' + this.pokemonId)
    // this.description = temp['data']['flavor_text_entries'][2].flavor_text
  },
  computed: {
    ...mapState('pokemons', ['dataKeys', 'pokemonList']),
    pokemon() {
      return this.pokemonList[this.pokemonId]
    }
  },
  methods: {
    capturePokemon() {
      let randomNumber = Math.floor(Math.random() * 100)
      let captureSuccess = false
      // Capture chance 50%
      if (randomNumber < 50) {
        captureSuccess = true
      } else {
        captureSuccess = false
      }
      /* Open modal with PokemonCapture component */
      this.$buefy.modal.open({
        parent: this,
        component: PokemonCapture,
        hasModalCard: true,
        trapFocus: true,
        props: {
          success: captureSuccess,
          pokemonName: this.pokemon.name,
          pokemonId: this.pokemonId
        },
        'can-cancel': ['escape', 'x']
      })
    },
    async getPokemon() {
      this.isLoading.pokemon = true
      await this.$store.dispatch('pokemons/fetchPokemon', this.pokemonId)
      this.isLoading.pokemon = false
    },
    async getPokemonMoves() {
      this.isLoading.moves = true
      await this.$store.dispatch('pokemons/fetchPokemonMoves', this.pokemonId)
      this.isLoading.moves = false
    }
  }
}
</script>
