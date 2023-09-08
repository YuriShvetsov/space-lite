<template>
  <div class="icon-selector" tabindex="0">
    <button class="icon-selector__toggle-button">
      <Icon class="icon-selector__selected-icon" :name="selectedIcon" />
    </button>

    <div class="icon-selector__list-wrapper">
      <ul class="icon-selector__list" ref="listRef">
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
import { findIndex } from 'lodash'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'icon-selector',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    icons: {
      type: Array,
      default: []
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedIcon = ref(props.modelValue)
    const listRef = ref(null)

    function changeSelectedIcon(iconName) {
      selectedIcon.value = iconName
      emit('update:modelValue', iconName)
    }

    function formatIconId(icon) {
      return `#${icon}`
    }

    function getItemClasses(icon) {
      return {
        'icon-selector__item_active': icon === selectedIcon.value
      }
    }

    function scrollToActiveIcon() {
      const activeIconIndex = findIndex(
        props.icons,
        (icon) => icon === selectedIcon.value
      )
      const listElements = [...listRef.value.children]
      const activeIconElement = listElements[activeIconIndex]

      activeIconElement.scrollIntoView({ block: 'center' })
    }

    onMounted(() => {
      scrollToActiveIcon()
    })

    return {
      selectedIcon,
      formatIconId,
      changeSelectedIcon,
      getItemClasses,
      listRef
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/env';

.icon-selector {
  position: relative;

  &__toggle-button {
    display: none;
    width: 36px;
    height: 36px;
    position: relative;

    background-color: transparent;
    border: 1px solid #e2e1de;
    outline: 0 solid lighten($primaryColor, 32%);
    border-radius: 50%;
    cursor: default;
  }

  &_opened .icon-selector__toggle-button {
    background-color: transparent;
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

    border: 1px solid #e2e1de;
    outline: 0 solid lighten($primaryColor, 32%);
    border-radius: 6px;

    @include custom-scrollbar(#fff);
  }

  &__item {
    width: 36px;
    height: 36px;
    position: relative;
    border: 1px solid $transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.8;
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
    transition: stroke 0.15s ease;
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
