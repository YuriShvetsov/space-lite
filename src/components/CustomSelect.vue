<template>
  <div class="select"
    v-bind:class="{ 'select_open': isOpened }"
  >

    <input class="select__input" 
      readonly
      v-bind:value="curOptionIsEmpty ? '' : curOption.name"
      v-bind:placeholder="placeholder || clearOptionName"
      v-on:click="onClickInput"
      v-on:keydown="onKeydownInput"
      ref="input"
    >
    <div class="select__options">
      <ul class="select__option-list" ref="optionsList"
        v-on:keydown="onKeydownOptionsList"
      >
        <li class="select__option"
          v-bind:class="{ 'select__option_clear': option.value === '' }"
          tabindex="0"
          v-for="(option, index) in allOptions"
          v-bind:key="index"
          v-bind:data-value="option.value"
          v-on:click="onClickOption"
          v-on:keydown="onKeydownOption"
        >{{ option.name }}</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    clearOptionName: {
      type: String,
      default: ''
    },
    mainOptions: {
      type: Array
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpened: false
    }
  },
  computed: {
    normalizedModelValue() {
      return this.modelValue.toLowerCase()
    },
    value: {
      get() {
        return this.normalizedModelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    allOptions() {
      return [{ name: this.clearOptionName, value: '' }].concat(this.mainOptions)
    },
    clearOption() {
      return this.allOptions[0]
    },
    curOption() {
      return this.allOptions.find(item => item.value === this.value)
    },
    curOptionIsEmpty() {
      return this.value === ''
    },
    curOptionIndex() {
      return this.allOptions.findIndex(item => item.value === this.value)
    }
  },
  methods: {
    setValue(value) {
      this.value = value
    },
    setNextOption() {
      if (this.curOptionIndex < this.allOptions.length - 1) {
        this.value = this.allOptions[this.curOptionIndex + 1].value
      }
    },
    setPrevOption() {
      if (this.curOptionIndex > 0) {
        this.value = this.allOptions[this.curOptionIndex - 1].value
      }
    },

    // Controlling of options list state
    toggle() {
      this.isOpened = !this.isOpened
    },
    open() {
      this.isOpened = true
    },
    close() {
      this.isOpened = false
    },

    // Focusing
    focusOnInput() {
      this.$refs.input.focus()
    },
    focusOnCurOption() {
      this.getOptionsElements().find(element => element.dataset.value === this.value).focus()
    },

    // Click handlers
    onClickInput(e) {
      e.preventDefault()
      this.toggle()

      if (this.isOpened) {
        this.$nextTick(this.focusOnCurOption)
      } else {
        this.focusOnInput()
      }
    },
    onClickOption(e) {
      this.setValue(e.target.dataset.value)
      this.focusOnInput()
    },
    handleClickDocument() {
      document.body.addEventListener('click', event => {
        if (!this.$el.contains(event.target) && !event.target.closest('.select')) {
          this.close()
        }
      })
    },

    // Keydown handlers
    onKeydownInput(e) {
      
      if (e.key === 'Enter') {
        e.preventDefault()
        this.toggle()

        if (this.isOpened) {
          this.$nextTick(this.focusOnCurOption)
        } else {
          this.focusOnInput()
        }
      }
    },
    onKeydownOption(e) {
      e.preventDefault()

      if (e.key === 'Enter') {
        this.setValue(e.target.dataset.value)
        this.close()
        this.focusOnInput()
      } else if (e.key === 'ArrowDown') {
        this.setNextOption()
        this.$nextTick(this.focusOnCurOption)
      } else if (e.key === 'ArrowUp') {
        this.setPrevOption()
        this.$nextTick(this.focusOnCurOption)
      }
    },

    // Helpers
    getOptionsElements() {
      return Array.from(this.$refs.optionsList.querySelectorAll('.select__option'))
    },
    normalizeOptionValues() {
      this.mainOptions.forEach((option, index) => {
        this.mainOptions[index].value = option.value.toLowerCase()
      })
    }
  },
  created() {
    this.normalizeOptionValues()
  },
  mounted() {
    this.handleClickDocument()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/env';

.select {
  width: 100%;
  position: relative;
}

.select__input {
  width: 100%;
  padding: 6px;
  display: block;
  
  font-family: $fontMain;
  font-size: 13px;
  color: #464646;

  background-color: #f0f2f5;
  border: none;
  border-radius: 3px;
  outline: none;
  user-select: none;
  cursor: pointer;
}

.select_open .select__input {
  background-color: #f6f7f9;
  border: none;
  outline: none;
}

.select__input:focus {
  background-color: #f6f7f9;
  border: none;
  outline: none;
}

.select__options {
  width: 100%;
  height: 100%;
  max-height: 160px;
  margin-top: 3px;
  padding: 6px;
  position: relative;

  display: none;

  background-color: get-light($bgColor, 'main');
  border: 1px solid #f0f2f5;
  border-radius: 3px;

  overflow-y: auto;
}

.select__options::before {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(-100%);

  background-color: $transparent;
}

.select__option-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.select_open .select__options {
  display: block;
}

.select__option {
  padding: 6px 10px;

  font-size: 13px;
  color: #464646;

  background-color: $transparent;
  border-radius: 3px;
  outline: none;

  user-select: none;
  cursor: pointer;
  transition: background-color .15s ease-out;
}

.select__option:hover {
  background-color: rgba(0,0,0,.02);
}

.select__option:focus {
  background-color: lighten($primaryColor, 34%);
  transition: none;
}

.select__option_clear {
  color: #aaa;
}

.select__option_clear:hover:focus {
  background-color: lighten($primaryColor, 34%);
}

.select__option_clear:hover {
  background-color: rgba(0,0,0,.02);
}

// Dark theme

.app_theme_dark {

  .select__input {
    color: get-dark($baseTextColor);
    background-color: get-dark($bgColor, 'main');
  }

  .select__input:focus {
    background-color: darken(get-dark($bgColor, 'main'), 6%);
  }

  .select__options {
    background-color: get-dark($bgColor, 'main');
    border: 1px solid get-dark($formBorderColor);
  }

  .select__option {
    color: get-dark($baseTextColor);
  }

  .select__option:hover {
    background-color: darken(get-dark($bgColor, 'main'), 6%);
  }

  .select__option:focus {
    background-color: $primaryColor;
  }

  .select__option_clear {
    color: darken(get-dark($secondaryTextColor), 15%);
  }

}

</style>
