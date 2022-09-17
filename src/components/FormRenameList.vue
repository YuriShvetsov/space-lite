<template>
  <form class="form"
    v-on:submit.prevent
  >
    
    <div class="form__header">
      <div class="form__title title title_size_s title_color_primary">Renaming of list</div>
    </div>

    <div class="form__body">

      <div class="form__row form__row_padding_bottom">
        <label class="form__label">
          <span class="form__label-name">Name*</span>
          <div class="form__input-wrapper">
            <input type="text"
              spellcheck="false"
              autocomplete="off"
              name="name"
              important
              class="form__input form__input_type_text js-input"
              v-model.trim="_name"
            >
            <svg class="form__icon form__icon_fill_red form__icon_pos_right_center">
              <use xlink:href="#warning"></use>
            </svg>
          </div>
        </label>
      </div>

      <div class="form__row form__row_x_center">
        <button class="form__control-button button button_fill_violet"
          v-on:click="emitSuccess"
        >OK</button>
        <button class="form__control-button button"
          v-on:click="emitCancel"
        >CANCEL</button>
      </div>

    </div>

  </form>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters(['lists']),
    listNames() {
      return this.lists.map(list => list.name).filter(name => name !== this.name)
    },
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

      return Array.from(inputs).filter(input => input.hasAttribute('important'))
    },
    getInvalidImportantInputs() {
      const importantInputs = this.getImportantInputs()

      return importantInputs.filter(input => {
        if (input.value.length === 0) return true

        if (input.getAttribute('name') === 'name') {
          return this.listNames.includes(this._name)
        }
      })
    },
    importantInputsValid() {
      const invalidImportantInputs = this.getInvalidImportantInputs()

      return invalidImportantInputs.length === 0
    },
    showWarnOnImportantInputs() {
      const invalidImportantInputs = this.getInvalidImportantInputs()

      invalidImportantInputs.forEach(input => {
        input.classList.add('form__input_warn')
      })
    },
    hideWarnOnImportantInput(input) {
      input.classList.remove('form__input_warn')
    },
    focusOnFirstEmptyImportantInput() {
      const firstInvalidImportantInput = this.getInvalidImportantInputs()[0]

      firstInvalidImportantInput.focus()
    },
    checkImportantInputs() {
      const importantInputs = this.getImportantInputs()

      importantInputs.forEach(input => {
        if (input.value.length > 0) this.hideWarnOnImportantInput(input)
      })
    },

    emitSuccess() {
      if (!this.importantInputsValid()) {
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
