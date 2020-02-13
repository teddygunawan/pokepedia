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
      <p class="card-header-title is-capitalized">{{ props.pokemon.name }}<br /></p>
    </header>
    <div class="card-content">
      <div class="content">
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
        <!-- <div class="buttons">
          <b-button
            rounded
            :class="'type-' + pokemonType.type.name"
            v-for="pokemonType in pokemon.types"
            :key="pokemonType.slot"
          >
            {{ pokemonType.type.name }}
          </b-button>
        </div> -->
        <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
        iaculis mauris.
        <a href="#">@bulmaio</a>. <a href="#">#css</a>
        <a href="#">#responsive</a>
        <br />
        <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pokemon: { required: true }
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
