<template>
  <div class="columns border-y is-vcentered is-mobile">
    <div class="column is-3 has-text-right-desktop">
      <slot name="info-name"></slot>
    </div>
    <div class="column">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>
