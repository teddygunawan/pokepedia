<template>
  <section>
    <h3 class="title is-3">Base Stats</h3>
    <div class="pokemon-stats">
      <div class="columns is-mobile">
        <div class="column is-3-touch is-2-tablet has-text-weight-semibold">Stat</div>
        <div class="column is-offset-7 is-2-phone is-1-tablet has-text-weight-semibold">Min</div>
        <div class="column is-2-phone is-1-tablet has-text-weight-semibold">Max</div>
      </div>
      <div v-for="pokemonStat in pokemonStats" :key="pokemonStat.stat.name">
        <div class="columns is-vcentered is-mobile">
          <div class="column is-3-touch is-2-tablet is-capitalized">
            {{ pokemonStat.stat.name.replace('special-', 'Sp. ') }}
          </div>
          <div class="column is-1 is-paddingless has-text-centered">{{ pokemonStat.base_stat }}</div>
          <div class="column is-6">
            <b-progress
              :precision="0"
              :type="statClass(pokemonStat.base_stat)"
              :value="pokemonStat.base_stat"
              :max="maxStatReference"
            ></b-progress>
          </div>
          <div class="column is-2-phone is-1-tablet">
            {{ Math.floor(maxLevelStat(pokemonStat)) }}
          </div>
          <div class="column is-2-phone is-1-tablet">
            {{ Math.floor(maxStat(pokemonStat)) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      maxStatReference: 180 // Obtained from multiple pokemon wikis
    }
  },
  props: {
    pokemonStats: { required: true }
  },
  methods: {
    statClass(baseStat) {
      let statReference = this.maxStatReference
      let statPercentage = (baseStat / statReference) * 100
      if (statPercentage < 30) return 'is-danger'
      else if (statPercentage < 50) return 'is-warning'
      else if (statPercentage < 60) return 'is-success'
      else return 'is-info'
    },
    // Including bonus from maximum EV and IV
    maxStat(pokemonStat) {
      let statName = pokemonStat.stat.name
      let baseStat = pokemonStat.base_stat
      if (statName == 'hp') {
        return baseStat * 2 + 204
      } else {
        return (baseStat * 2 + 99) * 1.1
      }
    },
    // Only stat from maximum level but 0 EV and IV
    maxLevelStat(pokemonStat) {
      let statName = pokemonStat.stat.name
      let baseStat = pokemonStat.base_stat
      if (statName == 'hp') {
        return baseStat * 2 + 110
      } else {
        return (baseStat * 2 + 5) * 0.9
      }
    }
  }
}
</script>

<style scoped>
</style>
