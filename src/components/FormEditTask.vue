<template>
  <form class="form"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_s title_color_primary">Editing of task</div>
    </div>

    <div class="form__body">

      <div class="form__row">
        <label class="form__label">
          <span class="form__label-name">Name*</span>
          <div class="form__input-wrapper">
            <input type="text"
              spellcheck="false"
              autocomplete="off"
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

      <div class="form__row">
        <label class="form__label">
          <span class="form__label-name">Notes</span>
          <TextBox
            v-bind:rows="5"
            v-bind:spellcheck="false"
            v-model="_notes"
          ></TextBox>
        </label>
      </div>

      <div class="form__row form__row_padding_bottom">
        <label class="form__label">
          <span class="form__label-name">Priority</span>
        </label>
        <LineSelect
          v-model="_priority"
          v-bind="prioritySelectSettings"
        />
      </div>

      <div class="form__row form__row_x_center">
        <button
          class="form__control-button button button_fill_violet"
          v-on:click="emitSuccess"
        >OK</button>
        <button
          class="form__control-button button"
          v-on:click="emitCancel"
        >CANCEL</button>
      </div>

    </div>

  </form>
</template>

<script>
import { focusFirstElement, catchFocus } from '../js/focusForm'

export default {
  name: 'form-edit-task',
  emits: ['success', 'cancel'],
  props: {
    id: String,
    done: Boolean,
    name: String,
    notes: String,
    priority: String
  },
  data() {
    return {
      _name: '',
      _notes: '',
      _priority: '',
      isMounted: false,
      prioritySelectSettings: {
        options: [
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
        name: this._name,
        notes: this._notes,
        priority: this._priority
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

    emitSuccess() {
      if (!this.importantInputsAreFilled()) {
        this.showWarnOnImportantInputs()
        this.focusOnFirstEmptyImportantInput()
        return
      }

      this.$emit('success', {
        name: this._name,
        notes: this._notes,
        priority: this._priority
      })
    },
    emitCancel() {
      this.$emit('cancel')
    }
  },
  created() {
    this._name = this.name
    this._notes = this.notes
    this._priority = this.priority
  },
  mounted() {
    this.isMounted = true
    focusFirstElement(this.$el)
    catchFocus(this.$el)
  }
}
</script>
