<template>
  <section class="section">
    <h3 class="title is-3 is-capitalized">{{ pokemon.name }}</h3>
    <base-pokemon-info>
      <template v-slot:info-name>
        Type
      </template>
      <template v-slot:content>
        <div class="field has-addons">
          <p
            class="control is-marginless"
            v-for="pokemonType in pokemon.types"
            :key="pokemonType.slot"
          >
            <button class="button is-borderless" :class="'type-' + pokemonType.type.name">
              <span>{{ pokemonType.type.name }}</span>
            </button>
          </p>
        </div>
      </template>
    </base-pokemon-info>
    <base-pokemon-info>
      <template v-slot:info-name>Abilities</template>
      <template v-slot:content>
        <div v-for="pokemonAbility in pokemon.abilities" :key="pokemonAbility.slot">
          <nuxt-link class="is-capitalized is-size-5" to="#">
            {{ pokemonAbility.ability.name }}
          </nuxt-link>
          {{ pokemonAbility.is_hidden ? '(hidden)' : '' }}
        </div>
      </template>
    </base-pokemon-info>
    <base-pokemon-info>
      <template v-slot:info-name>Height</template>
      <template v-slot:content> {{ (pokemon.height * 0.1).toFixed(1) }} M </template>
    </base-pokemon-info>
    <base-pokemon-info>
      <template v-slot:info-name>Weight</template>
      <template v-slot:content> {{ (pokemon.weight * 0.1).toFixed(1) }} Kg </template>
    </base-pokemon-info>
  </section>
</template>
<script>
import BasePokemonInfo from '~/components/pokemons/BasePokemonInfo'
export default {
  components: {
    BasePokemonInfo
  },
  props: {
    pokemon: { required: true }
  }
}
</script>
<style scoped>
.border-y {
  border-collapse: collapse;
  border-width: 1px 0 1px 0;
  border-style: solid;
  border-color: #f0f0f0;
}
.column {
  padding: 4px 10px;
}
</style>
