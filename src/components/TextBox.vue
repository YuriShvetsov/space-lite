<template>
  <div class="text-box">

    <div class="text-box__input form__input form__textarea"
      contenteditable="true"
      role="textbox"
      tabindex="0"
      v-bind:spellcheck="spellcheck"
      v-on:input="onInput"
      ref="input"
    ></div>

  </div>
</template>

<script>
import { translateHtmlToStr, translateStrToHtml } from '../js/contentEditableTranslators'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    spellcheck: {
      type: Boolean,
      default: true
    },
    rows: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      _value: ''
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    onInput(event) {
      this.value = translateHtmlToStr(event.target.innerHTML)
    },
    setHeight() {
      const lineHeight = 20
      const padding = 6
      const minHeight = this.rows * lineHeight + padding * 2

      this.$refs.input.style.minHeight = minHeight + 'px'
    },
    setInnerHTML() {
      this.$refs.input.innerHTML = translateStrToHtml(this.value)
    }
  },
  mounted() {
    this.setHeight()
    this.setInnerHTML()
  }
}
</script>

<style scoped>
.text-box__input {
  width: 100%;
  max-height: 212px;

  white-space: pre-wrap;
  word-break: break-word;

  outline: none;
  overflow-y: auto;
  cursor: text;
}
</style>
