<template>
  <form class="form"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_s title_color_violet">Creating of task</div>
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
            v-model.trim="name"
            v-on:keydown="onKeydownInput"
          >
        </label>
      </div>

      <div class="form__row">
        <label class="form__label">
          <span class="form__label-name">Notes</span>
          <TextBox
            v-bind:spellcheck="false"
            v-bind:rows="5"
            v-model="notes"
          ></TextBox>
        </label>
      </div>

      <div class="form__row form__row_no-label">
        <label class="form__label">
          <span class="form__label-name">Priority</span>
          <CustomSelect
            v-model="priority"
            v-bind="prioritySelectSettings"
          ></CustomSelect>
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
  name: 'form-add-task',
  emits: ['success', 'cancel'],
  data() {
    return {
      name: '',
      notes: '',
      priority: '',

      isMounted: false,
      prioritySelectSettings: {
        clearOptionName: 'Not choosed',
        mainOptions: [
          {
            name: 'Low',
            value: 'low'
          },
          {
            name: 'Middle',
            value: 'middle'
          },
          {
            name: 'High',
            value: 'high'
          }
        ]
      }
    }
  },
  computed: {
    inputData() {
      return {
        name: this.name,
        notes: this.notes,
        priority: this.priority
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
      });
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
      });
    },
    onKeydownInput(e) {
      if (e.key === 'Enter') e.preventDefault()
    },

    emitSuccess() {
      if (!this.isMounted) return

      if (!this.importantInputsAreFilled()) {
        this.showWarnOnImportantInputs()
        this.focusOnFirstEmptyImportantInput()
        return
      }

      this.$emit('success', {
        name: this.name,
        notes: this.notes,
        priority: this.priority
      })
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
