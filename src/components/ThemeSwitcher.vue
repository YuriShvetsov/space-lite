<template>
  <div class="appearance-switcher">
    <label class="appearance-switcher__item"
      v-for="(theme, index) of themes"
      :key="index"
    >
      <input class="appearance-switcher__item-radio" type="radio"
        :value="theme"
        v-model="_curTheme"
      >
      <div class="appearance-switcher__item-marker"></div>
      <span class="appearance-switcher__item-text">{{ theme }}</span>
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'appearance-switcher',
  data() {
    return {
      _curTheme: null
    }
  },
  computed: {
    ...mapGetters(['curTheme', 'themes'])
  },
  watch: {
    _curTheme(value) {
      if (value === this.curTheme) return
      this.changeCurTheme(value)
    }
  },
  methods: {
    ...mapActions(['changeCurTheme'])
  },
  created() {
    this._curTheme = this.curTheme
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/env';

.appearance-switcher {
  display: flex;
}

.appearance-switcher__item {
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.appearance-switcher__item:not(:last-child) {
  margin-right: 12px;
}

.appearance-switcher__item-marker {
  width: 14px;
  height: 14px;
  position: relative;
  background-color: $gray;
  border-radius: 50%;
}

.appearance-switcher__item-marker::before {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 50%;
  transition: transform .15s ease;
}

.appearance-switcher__item-radio {
  display: none;
}

.appearance-switcher__item-radio:checked + .appearance-switcher__item-marker {
  background-color: $primaryColor;
  transition: background-color .15s ease;
}

.appearance-switcher__item-radio:checked + .appearance-switcher__item-marker::before {
  transform: translate(-50%, -50%) scale(.5);
}

.appearance-switcher__item-text {
  margin-top: 4px;
  font-size: 13px;
  text-transform: lowercase;
}

.appearance-switcher__item-text::first-letter {
  text-transform: uppercase;
}

// Dark theme

.app_theme_dark {

  .appearance-switcher__item-text {
    color: #fff;
  }

  .appearance-switcher__item-marker {
    background-color: get-dark($formBorderColor);
  }

  .appearance-switcher__item-marker::before {
    background-color: get-dark($bgColor, 'main');
    transition: unset;
  }

  .appearance-switcher__item-radio:checked + .appearance-switcher__item-marker::before {
    background-color: #fff;
  }

}
</style>
