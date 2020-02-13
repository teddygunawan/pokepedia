<template>
  <section class="section">
    <h3 class="title is-3">Pokemon Collection</h3>
    <user-pokemon-list />
  </section>
</template>

<script>
import UserPokemonList from '~/components/user/UserPokemonList'
export default {
  components: {
    UserPokemonList
  }
}
</script>
