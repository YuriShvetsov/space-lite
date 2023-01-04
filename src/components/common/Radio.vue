<template>
  <div class="radio-wrapper">
    <label class="radio"
      v-for="(item, index) of items"
      :key="index"
    >
      <input class="radio__input" type="radio"
        :value="item.value"
        v-model="_curValue"
      >
      <div class="radio__marker"></div>
      <span class="radio__text">{{ item.name }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'radio',
  props: {
    items: {
      type: Array,
      default: []
    },
    current: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      _curValue: null
    }
  },
  watch: {
    _curValue(value) {
      if (this._current === value) return
      this.$emit('update', value)
    }
  },
  methods: {
    init() {
      if (!this.current) {
        this._curValue = this.items[0].value
        return
      }

      this._curValue = this.current
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/env';

.radio-wrapper {
  display: flex;
}

.radio {
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.radio:not(:last-child) {
  margin-right: 18px;
}

.radio__marker {
  width: 14px;
  height: 14px;
  position: relative;
  background-color: $gray;
  border-radius: 50%;
}

.radio__marker::before {
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

.radio__input {
  display: none;
}

.radio__input:checked + .radio__marker {
  background-color: $primaryColor;
  transition: background-color .15s ease;
}

.radio__input:checked + .radio__marker::before {
  transform: translate(-50%, -50%) scale(.5);
}

.radio__text {
  margin-top: 4px;
  font-size: 12px;
}

// Dark theme

.app_theme_dark {

  .radio__text {
    color: #fff;
  }

  .radio__marker {
    background-color: get-dark($formBorderColor);
  }

  .radio__marker::before {
    background-color: get-dark($bgColor, 'main');
    transition: unset;
  }

  .radio__input:checked + .radio__marker::before {
    background-color: #fff;
  }
}
</style>
