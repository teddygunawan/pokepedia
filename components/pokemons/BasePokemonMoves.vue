<template functional>
  <section>
    <h3 class="title is-3">Moves List</h3>
    <!-- TBD - DO LAZY LOADING TO IMPROVE PERFORMANCE AND STOP SCREEN FROM FREEZING -->
    <b-table :data="props.pokemonMoves" :mobile-cards="true" :loading="props.isLoading" :paginated="true" :pagination-size="'is-large'" per-page="10">
      <template slot-scope="props">
        <b-table-column field="level_requirement" label="Lv." sortable numeric>
          <span class="is-capitalized">{{ props.row.level_requirement }}</span>
        </b-table-column>
        <b-table-column field="name" label="Name" sortable>
          <nuxt-link to="#">
            <span class="is-capitalized">{{ props.row.name.replace('-', ' ') }}</span>
          </nuxt-link>
        </b-table-column>

        <b-table-column field="type" label="Type" sortable centered>
          <button class="button is-borderless" :class="'type-' + props.row.type">
            <span>{{ props.row.type }}</span>
          </button>
        </b-table-column>
        <b-table-column field="damage_class" label="Damage Type" sortable centered>
          <img
            :src="'https://img.pokemondb.net/images/icons/' + props.row.damage_class + '.png'"
            :alt="props.row.damage_class"
          />
        </b-table-column>

        <b-table-column field="pp" label="PP" sortable centered>
          {{ props.row.pp ? props.row.pp : '--' }}
        </b-table-column>
        <b-table-column field="accuracy" label="Accuracy" sortable centered>
          {{ props.row.accuracy ? props.row.accuracy : '--' }}
        </b-table-column>

        <b-table-column field="power" label="Power" sortable centered>
          {{ props.row.power ? props.row.power : '--' }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  props: {
    pokemonMoves: { required: true },
    isLoading: {required: true}
  }
}
</script>
<style scoped>
.button {
  width: 70px;
}
td {
  vertical-align: middle;
}
</style>
