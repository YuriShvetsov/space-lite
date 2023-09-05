<template>
  <div class="icon-selector">
    
    <button class="icon-selector__toggle-button">
      <Icon class="icon-selector__selected-icon" :name="selectedIcon" />
    </button>

    <div class="icon-selector__list-wrapper">
      <ul class="icon-selector__list">
        <li
          v-for="(icon, index) of icons"
          class="icon-selector__item"
          :class="getItemClasses(icon)"
          :key="index"
          @click="changeSelectedIcon(icon)"
        >
          <Icon class="icon-selector__item-icon" :name="icon" />
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'icon-selector',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    icons: {
      type: Array,
      default: [],
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedIcon = ref(props.modelValue)

    function changeSelectedIcon(iconName) {
      selectedIcon.value = iconName
      emit('update:modelValue', iconName)
    }

    function formatIconId(icon) {
      return `#${ icon }`
    }

    function getItemClasses(icon) {
      return {
        'icon-selector__item_active': icon === selectedIcon.value
      }
    }

    return {
      selectedIcon,
      formatIconId,
      changeSelectedIcon,
      getItemClasses
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/env';

.icon-selector {
  position: relative;

  &__toggle-button {
    width: 36px;
    height: 36px;
    position: relative;

    background-color: #f0f2f5;
    border: none;
    border-radius: 50%;
    cursor: default;
  }

  &_opened .icon-selector__toggle-button {
    background-color: #f6f7f9;
  }

  &__selected-icon {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    stroke: get-light($baseTextColor);
  }

  &__list-wrapper {
    max-width: 300px;
    max-height: 140px;
    margin-top: 8px;

    background-color: #fff;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-width: inherit;
    max-height: inherit;
    margin: 0;
    padding: 8px;
    overflow-y: auto;

    background-color: #f0f2f5;
    border-radius: 4px;

    @include custom-scrollbar(#f0f2f5);
  }

  &__item {
    width: 36px;
    height: 36px;
    position: relative;
    border: 1px solid $transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: opacity .15s ease;

    &:hover {
      opacity: .8;
    }

    &_active,
    &_active:hover {
      background-color: lighten($primaryColor, 32%);
      opacity: 1;
    }
  }

  &__item-icon {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    stroke: get-light($baseTextColor);
    transition: stroke .15s ease;
  }

  &__item_active .icon-selector__item-icon {
    stroke: $primaryColor;
  }
}

@include dark-theme {

  .icon-selector {
    &__toggle-button {
      background-color: get-dark($bgColor, 'main');
    }
  
    &__selected-icon {
      stroke: #ffffff;
    }

    &__list-wrapper {
      background-color: $transparent;
    }

    &__list {
      background-color: get-dark($bgColor, 'main');
      @include custom-scrollbar(get-dark($bgColor, 'main'));
    }

    &__item {
      &:hover {
        background-color: darken(get-dark($bgColor, 'main'), 4%);
      }

      &_active,
      &_active:hover {
        background-color: $primaryColor;
      }
    }

    &__item-icon {
      stroke: #ffffff;
    }

    &__item:hover .icon-selector__item-icon {
      stroke: #ffffff;
    }

    &__item_active:hover .icon-selector__item-icon {
      stroke: #ffffff;
    }

  }

}
</style>
