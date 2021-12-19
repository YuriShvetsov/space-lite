<template>
  <form class="form"
    v-on:submit.prevent
  >
    
    <div class="form__header">
      <div class="form__title title title_size_s title_color_violet">Renaming of list</div>
    </div>

    <div class="form__body">

      <div class="form__row">
        <label class="form__label">
          <span class="form__label-name">Name</span>
          <input type="text"
            spellcheck="false"
            autocomplete="off"
            important
            class="form__input form__input_type_text js-input"
            v-model.trim="_name"
          >
        </label>
      </div>

      <div class="form__row form__row_controls">
        <button class="form__control-button button button_type_submit"
          v-on:click="emitSuccess"
        >OK</button>
        <button class="form__control-button button"
          v-on:click="emitCancel"
        >Cancel</button>
      </div>

    </div>

  </form>
</template>

<script>
import { focusFirstElement, catchFocus } from '../js/focusForm'

export default {
  name: 'form-rename-list',
  emits: ['success', 'cancel'],
  props: {
    name: String
  },
  data() {
    return {
      _name: '',
      isMounted: false
    }
  },
  computed: {
    inputData() {
      if (!this.isMounted) return

      return {
        name: this._name
      }
    }
  },
  watch: {
    inputData(newValue) {
      this.checkImportantInputs()
    }
  },
  methods: {
    init() {
      this._name = this.name
    },

    getInputs() {
      return this.$el.querySelectorAll('.js-input')
    },
    getImportantInputs() {
      const inputs = this.getInputs()
      const importantInputs = Array.from(inputs).filter(input => input.hasAttribute('important'))

      return importantInputs
    },
    getEmptyImportantInputs() {
      const importantInputs = this.getImportantInputs()

      return importantInputs.filter(input => input.value.length === 0)
    },
    importantInputsAreFilled() {
      const emptyImportantInputs = this.getEmptyImportantInputs()

      return emptyImportantInputs.length === 0
    },
    showWarnOnImportantInputs() {
      const emptyImportantInputs = this.getEmptyImportantInputs()

      emptyImportantInputs.forEach(input => {
        input.classList.add('form__input_warn')
      })
    },
    hideWarnOnImportantInput(input) {
      input.classList.remove('form__input_warn')
    },
    focusOnFirstEmptyImportantInput() {
      const firstEmptyImportantInput = this.getEmptyImportantInputs()[0]

      firstEmptyImportantInput.focus()
    },
    checkImportantInputs() {
      const importantInputs = this.getImportantInputs()

      importantInputs.forEach(input => {
        if (input.value.length > 0) this.hideWarnOnImportantInput(input)
      })
    },

    emitSuccess() {
      if (!this.importantInputsAreFilled()) {
        this.showWarnOnImportantInputs()
        this.focusOnFirstEmptyImportantInput()
        return
      }

      this.$emit('success', this._name)
    },
    emitCancel() {
      this.$emit('cancel')
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.isMounted = true
    focusFirstElement(this.$el)
    catchFocus(this.$el)
  }
}
</script>
