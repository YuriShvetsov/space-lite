<template>
  <form class="form"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_s title_color_primary">Creating of list</div>
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
              v-model.trim="name"
            >
            <svg class="form__icon form__icon_fill_red form__icon_pos_right_center">
              <use xlink:href="#warning"></use>
            </svg>
            <div class="form__input-warning">{{ nameWarningText }}</div>
          </div>
        </label>
      </div>

      <div class="form__row form__row_x_center">
        <input class="form__control-button button button_fill_violet"
          type="submit"
          v-on:click.prevent="emitSuccess"
          value="OK"
        >
        <input class="form__control-button button"
          type="button"
          v-on:click="emitCancel"
          value="CANCEL"
        >
      </div>

    </div>

  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import { focusFirstElement, catchFocus } from '../js/focusForm'

export default {
  name: 'form-add-list',
  emits: ['success', 'cancel'],
  data() {
    return {
      name: '',
      isMounted: false,
      nameWarningText: ''
    }
  },
  computed: {
    ...mapGetters(['lists']),
    listNames() {
      return this.lists.map(list => list.name)
    },
    inputData() {
      return {
        name: this.name
      }
    }
  },
  watch: {
    inputData(newValue) {
      if (!this.isMounted) return

      this.checkImportantInputs()
    }
  },
  methods: {
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
        const inputName = input.getAttribute('name')

        switch (inputName) {
          case 'name':
            if (!input.value.length) {
              this.nameWarningText = 'Name can\'t be empty';
              return true
            }

            if (this.listNames.includes(this.name)) {
              this.nameWarningText = 'This name is already exists';
              return true
            }
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
    focusOnFirstInvalidImportantInput() {
      const firstInvalidImportantInput = this.getInvalidImportantInputs()[0]

      firstInvalidImportantInput.focus()
    },
    checkImportantInputs() {
      const importantInputs = this.getImportantInputs()

      importantInputs.forEach(input => {
        if (input.value.length > 0) {
          this.hideWarnOnImportantInput(input)
          this.nameWarningText = ''
        }
      })
    },

    emitSuccess() {
      if (!this.isMounted) return

      if (!this.importantInputsValid()) {
        this.showWarnOnImportantInputs()
        this.focusOnFirstInvalidImportantInput()
        return
      }

      this.$emit('success', this.name)
      this.isMounted = false
    },
    emitCancel() {
      if (!this.isMounted) return

      this.$emit('cancel')
      this.isMounted = false
    }
  },
  mounted() {
    this.isMounted = true
    focusFirstElement(this.$el)
    catchFocus(this.$el)
  }
}
</script>
