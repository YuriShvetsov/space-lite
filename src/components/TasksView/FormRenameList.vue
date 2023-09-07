<template>
  <form class="form form_type_input"
    @submit.prevent
  >
    
    <div class="form__header">
      <div class="form__title title title_size_l">Rename list</div>
      <button class="form__cancel-button button button_type_icon button_color_black"
        @click="emitCancel"
      >
        <span>Cancel</span>
        <Icon class="button__icon button__icon_fill" name="close" />
      </button>
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
            <Icon class="form__icon form__icon_fill_red form__icon_pos_right_center" name="warning" />
            <div class="form__input-warning" :class="nameWarningClasses">{{ nameWarningText }}</div>
          </div>
        </label>
      </div>

      <div class="form__row form__row_input">
        <label class="form__label">
          <span class="form__label-name">Icon</span>
          <div class="form__input-wrapper">
            <icon-selector
              class="form__icon-selector"
              v-model="_icon"
              :icons="listIcons"
            />
          </div>
        </label>
      </div>

      <div class="form__row form__row_controls">
        <button class="form__control-button form__control-button_scale_max button button_fill_violet"
          v-on:click="emitSuccess"
        >Save Changes</button>
      </div>

    </div>

  </form>
</template>

<script>
import { mapGetters } from 'vuex'

import { focusFirstElement, catchFocus, execWhenShiftEnter } from '@/utils/focusForm.js'
import { DEFAULT_LIST_ICON, LIST_ICONS } from '@/js/static/listIcons'

export default {
  name: 'form-rename-list',
  emits: ['success', 'cancel'],
  props: {
    name: String,
    icon: [String, null]
  },
  data() {
    return {
      _name: '',
      _icon: null,
      isMounted: false,
      nameWarningText: ''
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
        name: this._name,
        icon: this._icon
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
      this.checkImportantInputs()
    }
  },
  methods: {
    init() {
      this.listIcons = LIST_ICONS
      this._name = this.name
      this._icon = this.icon ? this.icon : DEFAULT_LIST_ICON
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
        const inputName = input.getAttribute('name')

        switch (inputName) {
          case 'name':
            if (!input.value.length) {
              this.nameWarningText = 'Name can\'t be empty';
              return true
            }

            if (this.listNames.includes(this._name)) {
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
      if (!this.importantInputsValid()) {
        this.showWarnOnImportantInputs()
        this.focusOnFirstEmptyImportantInput()
        return
      }

      this.$emit('success', {
        name: this._name,
        icon: this._icon
      })
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
    this.removeShiftEnter = execWhenShiftEnter(this.emitSuccess)

    focusFirstElement(this.$el)
    catchFocus(this.$el)
  },
  beforeUnmount() {
    this.removeShiftEnter()
  }
}
</script>
