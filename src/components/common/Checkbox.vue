<template>
  <label class="checkbox">
    <input class="checkbox__input"
      type="checkbox"
      :checked="_checked"
      @change.stop="emitChange"
    >
    <div class="checkbox__bg">
      <Icon class="checkbox__icon" name="check-bold" />
    </div>
  </label>
</template>

<script>
  export default {
    name: 'checkbox',
    props: {
      checked: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        _checked: null
      }
    },
    methods: {
      emitChange() {
        this.$emit('change')
      }
    },
    created() {
      this._checked = this.checked
    }
  }
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.checkbox {
  display: block;
  width: 16px;
  height: 16px;
  position: relative;
  cursor: pointer;
}

.checkbox__input {
  display: none;
}

.checkbox__bg {
  width: inherit;
  height: inherit;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-color: transparent;
  border: 1px solid $gray;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, .08);
  transition: background-color .15s ease, border .15s ease, box-shadow .15s ease;
}

.checkbox__icon {
  display: block;
  width: 10px;
  height: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.5);

  fill: none;
  stroke: #fff;
  opacity: 0;
  transition: opacity .15s ease, transform .15s ease;
}

.checkbox__input:checked +.checkbox__bg {
  background-color: $primaryColor;
  border: 1px solid $primaryColor;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, .15);

  .checkbox__icon {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@include dark-theme {

  .checkbox__bg {
    background-color: get-dark($bgColor, 'main');
    border: 1px solid get-dark($formBorderColor);
  }
}
</style>
