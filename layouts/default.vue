<template>
  <div>
    <TheHeading />

    <section class="main-content">
      <div class="container">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import TheHeading from '~/components/TheHeading'
export default {
  components: {
    TheHeading
  }, 
  // Run any store actions that need to fetch from local storage
  created() {
    this.$store.dispatch('user/preloadData')
  }
}
</script>
