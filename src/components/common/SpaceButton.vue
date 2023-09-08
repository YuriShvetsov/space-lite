<template>
  <button
    class="space-button"
    :class="classes"
    :disabled="disabled"
    type="button"
  >
    <span v-if="hasText">{{ name }}</span>
    <svg
      v-if="hasIcon"
      class="space-button__icon"
      :class="iconClasses"
      aria-hidden="true"
    >
      <use :xlink:href="formattedIcon"></use>
    </svg>
  </button>
</template>

<script>
import { defineComponent } from 'vue'

// Разделить все иконки на два типа: обычные и с префиксом -filled

export default defineComponent({
  name: 'SpaceButton',
  emits: {},
  props: {
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '',
      validator() {}
    },
    type: {
      type: String,
      default: 'default',
      validator(type) {
        return (
          ['default', 'left-icon', 'right-icon', 'icon'].indexOf(type) !== -1
        )
      }
    },
    category: {
      type: String,
      default: 'default',
      validator(category) {
        return (
          ['default', 'primary', 'accept', 'danger'].indexOf(category) !== -1
        )
      }
    },
    size: {
      type: String,
      default: 'default',
      validator(size) {
        return ['default', 'sm', 'md', 'lg'].indexOf(size) !== -1
      }
    },
    color: {
      type: String,
      default: 'default',
      validator(color) {
        return ['default', 'black', 'green', 'red'].indexOf(color) !== -1
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      const result = []

      if (this.size && this.size !== 'default') {
        result.push(`space-button_${this.size}`)
      }

      if (this.type && this.type !== 'default') {
        result.push(`space-button_${this.type}`)
      }

      if (this.category && this.category !== 'default') {
        result.push(`space-button_${this.category}`)
      }

      if (this.color && this.color !== 'default') {
        result.push(`space-button_${this.color}`)
      }

      return result
    },
    hasIcon() {
      return (
        ['left-icon', 'right-icon', 'icon'].includes(this.type) && this.icon
      )
    },
    hasText() {
      return this.type !== 'icon'
    },
    iconClasses() {},
    formattedIcon() {
      return `#${this.icon}`
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/env';

.space-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;

  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  color: $primaryColor;
  text-decoration: none;
  white-space: nowrap;

  background-color: $transparent;
  border: 1px solid $transparent;
  border-radius: 6px;
  outline: none;
  appearance: none;

  cursor: pointer;
  user-select: none;
  transition: background-color 150ms ease-in-out;
}

.space-button:hover {
  background-color: lighten($primaryColor, 34%);
}

.space-button__icon {
  width: 16px;
  height: 16px;
  stroke: $primaryColor;
}

// Type

.space-button_default {
}

.space-button_left-icon {
  padding: 5px 12px 5px 8px;
}

.space-button_left-icon .space-button__icon {
  order: -1;
}

.space-button_right-icon {
  padding: 5px 8px 5px 12px;
}

.space-button_icon {
  width: 28px;
  height: 28px;
  padding: 0;

  &:hover {
    background-color: $transparent;
    opacity: 0.8;
  }
}

// Category

.space-button_primary {
  color: #fff;
  background-color: lighten($primaryColor, 4%);

  &:hover {
    background-color: $primaryColor;
  }

  .space-button__icon {
    stroke: #fff;
  }

  &.space-button_icon:hover {
    opacity: 1;
  }
}

.space-button_accept {
  color: #fff;
  background-color: $green;

  &:hover {
    background-color: darken($green, 2%);
  }

  .space-button__icon {
    stroke: #fff;
  }

  &.space-button_icon:hover {
    opacity: 1;
  }
}

.space-button_danger {
  color: #fff;
  background-color: $red;

  &:hover {
    background-color: darken($red, 7%);
  }

  .space-button__icon {
    stroke: #fff;
  }

  &.space-button_icon:hover {
    opacity: 1;
  }
}

// Size

.space-button_sm {
  font-size: 12px;
}

.space-button_md {
  padding: 8px 14px;
  font-size: 14px;
}

.space-button_lg {
  padding: 12px 18px;
  font-size: 16px;
}

// Color

.space-button_black {
  color: $black;

  &:hover {
    background-color: lighten($black, 76%);
  }
}

.space-button_green {
  color: $green;

  &:hover {
    background-color: lighten($green, 49%);
  }
}

.space-button_red {
  color: $red;

  &:hover {
    background-color: lighten($red, 40%);
  }
}
</style>
