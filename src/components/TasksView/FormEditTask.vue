<template>
  <form class="form form_type_input"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_l">Edit task</div>
    </div>

    <div class="form__body">

      <div class="form__row form__row_input">
        <label class="form__label">
          <span class="form__label-name">Name <span class="form__required-sign">*</span></span>
          <div class="form__input-wrapper">
            <input type="text"
              spellcheck="false"
              autocomplete="off"
              name="name"
              important
              class="form__input form__input_type_text js-input"
              v-model.trim="_name"
              @keydown.enter.prevent
            >
            <svg class="form__icon form__icon_fill_red form__icon_pos_right_center">
              <use xlink:href="#warning"></use>
            </svg>
            <div class="form__input-warning" :class="nameWarningClasses">{{ nameWarningText }}</div>
          </div>
        </label>
      </div>

      <div class="form__row form__row_input">
        <label class="form__label">
          <span class="form__label-name">Notes</span>
          <TextBox
            v-bind:rows="7"
            v-bind:spellcheck="false"
            v-model="_notes"
          ></TextBox>
        </label>
      </div>

      <div class="form__row form__row_input">
        <label class="form__label">
          <span class="form__label-name">Priority</span>
        </label>
        <LineSelect
          v-model="_priority"
          v-bind="prioritySelectSettings"
        />
      </div>

      <div class="form__row form__row_controls">
        <button class="form__control-button form__control-button_scale_2-5 button"
          v-on:click="emitCancel"
        >Cancel</button>
        <button
          class="form__control-button form__control-button_scale_3-5 button button_fill_violet"
          v-on:click="emitSuccess"
        >Save Changes</button>
      </div>

    </div>

  </form>
</template>

<script>
import { focusFirstElement, catchFocus, execWhenShiftEnter } from '@/js/focusForm'

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
      },
      nameWarningText: ''
    }
  },
  computed: {
    inputData() {
      return {
        name: this._name,
        notes: this._notes,
        priority: this._priority
      }
    },
    nameWarningClasses() {
      return {
        'form__input-warning_active': !!this.nameWarningText
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
    getInvalidImportantInputs() {
      const importantInputs = this.getImportantInputs()

      return importantInputs.filter(input => {
        const inputName = input.getAttribute('name')
        const inputValue = input.value

        switch (inputName) {
          case 'name':
            if (!inputValue) {
              this.nameWarningText = 'Name can\'t be empty';
              return true
            }
        }
      })
    },
    importantInputsAreFilled() {
      const invalidImportantInputs = this.getInvalidImportantInputs()

      return invalidImportantInputs.length === 0
    },
    showWarnOnImportantInputs() {
      const invalidImportantInputs = this.getInvalidImportantInputs()

      invalidImportantInputs.forEach(input => {
        input.classList.add('form__input_warn')
      });
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
        if (input.value.length > 0) {
          this.hideWarnOnImportantInput(input)
          this.nameWarningText = ''
        }
      })
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
    this.removeShiftEnter = execWhenShiftEnter(this.emitSuccess)

    focusFirstElement(this.$el)
    catchFocus(this.$el)
  },
  beforeUnmount() {
    this.removeShiftEnter()
  }
}
</script>
