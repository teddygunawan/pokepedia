<template>
  <section>
    <!-- <b-modal :active="true" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <div class="modal-card" style="width: auto">
        hah
        <header class="modal-card-head">
        <div class="modal-card-title has-text-centered">
          <span :class="successCapture ? 'has-text-success' : 'has-text-danger'">{{
            captureText
          }}</span>
        </div>
      </header>
      <section class="modal-card-body">
        <div v-show="successCapture">
          hah
        </div>
        <div v-show="!successCapture">
          Better Luck Next Time!
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary">Login</button>
      </footer>
      </div>
    </b-modal> -->
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title has-text-centered">
          <div v-show="success">
            <span class="has-text-success">
              You Have Captured {{ vowel.includes(pokemonName.charAt(0)) ? 'an' : 'a' }}
            </span>
            <span class="is-capitalized has-text-weight-semibold">{{ pokemonName }}!</span>
          </div>
          <span class="has-text-danger" v-show="!success">
            The Pokemon Ran Away!
          </span>
        </div>
      </header>
      <i class="fa fa-circle-o" aria-hidden="true"></i>
      <section class="modal-card-body">
        <div v-show="success">
          <b-field label="Name Your New Pokemon!">
            <b-input
              placeholder="Something Cute"
              type="search"
              icon-pack="fas"
              icon="paw"
              v-model="newNickname"
              validation-message="Musn't be empty and only alphanumeric are allowed!"
              pattern="[a-zA-Z0-9\s]*"
              maxlength="16"
              required
            >
            </b-input>
          </b-field>
        </div>
        <div v-show="!success">
          Better Luck Next Time!
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="is-margin-x-auto">
          <button
            class="button"
            :class="success ? 'is-danger' : 'is-dark'"
            type="button"
            @click="$parent.close()"
          >
            {{ success ? 'Let Go' : "I'll Get it Next Time!" }}
          </button>
          <button class="button is-success" v-show="success" @click="commitCapturedPokemon">
            Add to Collection
          </button>
        </div>
      </footer>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      vowel: ['a', 'i', 'u', 'e', 'o'],
      newNickname: ''
    }
  },
  props: {
    success: { required: true },
    pokemonName: { required: true },
    pokemonId: { required: true }
  },
  methods: {
    commitCapturedPokemon() {
      let alphanumeric = /[a-zA-Z0-9\s]/g
      if (alphanumeric.test(this.newNickname) && this.newNickname.length <= 16) {
        let date = new Date()
        let newPokemon = {
          nickName: this.newNickname,
          id: this.pokemonId,
          timeCaptured: date.getTime() // Milliseconds
        }
        this.$store.dispatch('user/addCapturedPokemon', newPokemon)
        this.$parent.close()
      }
    }
  }
}
</script>

<style scoped>
.modal-card {
  width: auto;
}
</style>
