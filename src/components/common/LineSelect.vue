<template>
  <div class="line-select">
    <button
      class="line-select__option"
      :class="getOptionClasses(option)"
      v-for="(option, index) of options"
      v-bind:key="index"
      v-on:click="onClickOption(option.value)"
      v-on:mouseout="onMouseoutOption"
    >{{ option.name }}</button>
  </div>
</template>

<script>
export default {
  name: 'line-select',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: []
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {

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
    }
  },
  methods: {
    getOptionClasses(option) {
      return [
        option.value === this.value ? 'line-select__option_active' : '',
        option.color ? `line-select__option_color_${ option.color }` : ''
      ]
    },
    onClickOption(value) {
      if (value === this.value) {
        this.value = ''
        return
      }

      this.value = value
    },
    onMouseoutOption(e) {
      e.target.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env/index';

.line-select {
  display: flex;
  justify-content: center;
}

.line-select__option {
  width: 100%;
  padding: 7px 12px;

  font-size: 11px;
  text-transform: uppercase;

  background-color: #f0f2f5;
  border: none;
  border-radius: 4px;
  outline: none;
  appearance: none;

  cursor: pointer;
  transition: background-color .15s ease, color .15s ease;
}

.line-select__option:not(:last-child) {
  margin-right: 2px;
}

.line-select__option:hover,
.line-select__option:focus {
  background-color: #eaecf0;
}

.line-select__option_active {
  font-weight: 800;
  color: $primaryColor;
  background-color: lighten($primaryColor, 32%);
}

.line-select__option_active:hover,
.line-select__option_active:focus {
  background-color: lighten($primaryColor, 30%);
}

@include dark-theme {

  .line-select__option {
    color: get-dark($baseTextColor);
    background-color: get-dark($bgColor, 'main');
  }

  .line-select__option:hover,
  .line-select__option:focus {
    background-color: darken(get-dark($bgColor, 'main'), 4%);
  }

  .line-select__option_active {
    color: get-dark($baseTextColor);
    background-color: $primaryColor;
  }

  .line-select__option_active:hover,
  .line-select__option_active:focus {
    background-color: $primaryColor;
  }

}
</style>
