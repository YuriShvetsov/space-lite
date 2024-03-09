<template>
  <component
    :is="props.tag"
    class="button"
    :class="classes"
    v-bind="attrs"
  >
    <svg v-if="props.icon" class="button__icon">
      <use :xlink:href="`#${props.icon}`"></use>
    </svg>
    <span v-if="props.text" class="button__text">{{ props.text }}</span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
    validator: (value) => value.match(/(button|a)/)
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => value.match(/(default|fill)/)
  },
  size: {
    type: String,
    default: 'middle',
    validator: (value) => value.match(/(small|middle|large)/)
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) => value.match(/(default|primary|success|danger)/)
  },
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})
const classes = {
  [`button_type_${props.type}`]: true,
  [`button_size_${props.size}`]: true,
  [`button_color_${props.color}`]: true,
  button_icon: !props.text && props.icon
}
const attrs = (() => {
  const result = {}

  if (props.tag === 'button') {
    result.type = 'button'
  }

  return result
})()
</script>

<style lang="scss">
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  overflow: hidden;

  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;

  border: none;
  border-radius: 6px;
  box-shadow:
    inset 0 6px 12px rgba(255, 255, 255, 0.12),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  outline: none;
  appearance: none;

  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease-in-out;
}

.button__icon {
  width: 16px;
  height: 16px;
}

.button_icon {
  padding: 8px;
  border-radius: 8px;
}

.button:disabled,
.button[disabled=true] {
  opacity: 0.5;
  pointer-events: none;
}

// Type default

.button_type_default.button_color_default {
  color: $button-default-color;
  background-color: $button-default-background-color;

  &:hover {
    background-color: $button-default-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-default-background-color-focus;
  }
}

.button_type_default.button_color_primary {
  color: $button-primary-color;
  background-color: $button-primary-background-color;

  &:hover {
    background-color: $button-primary-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-primary-background-color-focus;
  }
}

.button_type_default.button_color_success {
  color: $button-success-color;
  background-color: $button-success-background-color;

  &:hover {
    background-color: $button-success-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-success-background-color-focus;
  }
}

.button_type_default.button_color_danger {
  color: $button-danger-color;
  background-color: $button-danger-background-color;

  &:hover {
    background-color: $button-danger-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-danger-background-color-focus;
  }
}

// Type fill

.button_type_fill.button_color_default {
  color: $button-fill-default-color;
  background-color: $button-fill-default-background-color;

  &:hover {
    background-color: $button-fill-default-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-fill-default-background-color-focus;
  }
}

.button_type_fill.button_color_primary {
  color: $button-fill-primary-color;
  background-color: $button-fill-primary-background-color;

  &:hover {
    background-color: $button-fill-primary-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-fill-primary-background-color-focus;
  }
}

.button_type_fill.button_color_success {
  color: $button-fill-success-color;
  background-color: $button-fill-success-background-color;

  &:hover {
    background-color: $button-fill-success-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-fill-success-background-color-focus;
  }
}

.button_type_fill.button_color_danger {
  color: $button-fill-danger-color;
  background-color: $button-fill-danger-background-color;

  &:hover {
    background-color: $button-fill-danger-background-color-hover;
  }

  &:focus,
  &:active {
    background-color: $button-fill-danger-background-color-focus;
  }
}

// Size

.button_size_small {
  gap: 5px;
  padding: 7px 10px;
  font-size: 12px;
}

.button_size_small.button_icon {
  padding: 7px;
  border-radius: 8px;
}

.button_size_small .button__icon {
  width: 16px;
  height: 16px;
}

.button_size_large {
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 8px;
}

.button_size_large.button_icon {
  padding: 10px;
  border-radius: 10px;
}

.button_size_large .button__icon {
  width: 20px;
  height: 20px;
}

</style>
