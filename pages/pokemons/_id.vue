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

    <template v-if="pokemon !== null">
      <div class="columns">
        <div class="column is-4 has-text-centered-touch">
          <img :src="pokemon.image" class="" />
        </div>
        <div class="column is-4 is-paddingless">
          <pokemon-features :pokemon="pokemon" />

          <div class="has-text-centered">
            <b-button type="is-danger" size="is-large" outlined>
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
          <base-pokemon-moves :pokemonMoves="pokemon.moves"/>
        </div>
      </div>
    </template>
    <b-loading :active.sync="isLoading" :can-cancel="false"></b-loading>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import PokemonStats from '~/components/pokemons/PokemonStats'
import PokemonFeatures from '~/components/pokemons/PokemonFeatures'
import BasePokemonMoves from '~/components/pokemons/BasePokemonMoves'
export default {
  components: {
    PokemonStats,
    PokemonFeatures,
    BasePokemonMoves
  },
  middleware: '',
  data() {
    return {
      pokemonId: this.$route.params.id,
      pokemon: null,
      description: ''
    }
  },
  async created() {
    /* TBD - SEPARATE THE LOAD FOR POKEMON AND MOVES FOR BETTER USABILITY */
    this.pokemon = await this.$store.dispatch('pokemons/fetchPokemonDetails', this.pokemonId)
    // let temp = await this.$axios.get('https://pokeapi.co/api/v2/pokemon-species/' + this.pokemonId)
    // this.description = temp['data']['flavor_text_entries'][2].flavor_text
  },
  computed: {
    ...mapState('pokemons', ['isLoading', 'dataKeys'])
  }
}
</script>
