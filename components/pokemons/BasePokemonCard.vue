<template functional>
  <div class="card">
    <div class="card-image pokemon-image">
      <figure class="image is-4by3">
        <nuxt-link :to="'/pokemons/' + props.pokemon.id">
          <img :src="props.pokemon.image" alt="Pokémon" />
        </nuxt-link>
      </figure>
    </div>
    <header class="card-header">
      <div class="card-header-title is-capitalized title is-4">
        {{ props.pokemon.name }} <slot name="options"></slot>
      </div>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="has-text-weight-semibold"><slot name="ownedCount"></slot></div>
        <div class="field has-addons">
          <p
            class="control is-marginless"
            v-for="pokemonType in props.pokemon.types"
            :key="pokemonType.slot"
          >
            <button class="button is-borderless" :class="'type-' + pokemonType.type.name">
              <span>{{ pokemonType.type.name }}</span>
            </button>
          </p>
        </div>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  props: {
    pokemon: { required: true },
    ownedPokemonCount: { required: false }
  }
}
</script>

<style scoped>
.pokemon-image {
  padding: 15px;
  transition: all 0.5s;
}
.pokemon-image:hover {
  opacity: 0.8;
}
.card-content {
  padding: 0.75rem;
}
</style>
