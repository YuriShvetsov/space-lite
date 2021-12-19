<template>
  <div class="upload-file">
    <button class="upload-file__button button button_type_text-icon button_icon_upload"
      v-on:click="onClickButton"
      v-on:keydown="onKeydownButton"
    >{{ name }}</button>
    <input type="file" class="upload-file__input"
      ref="inputFile"
      v-on:change="onChangeInput"
    >
    <span class="upload-file__file-name">{{ fileName }}</span>
    <span class="upload-file__error-msg">{{ errorMsg }}</span>
  </div>
</template>

<script>
export default {
  name: 'upload-file',
  props: {
    name: {
      type: String,
      default: 'Upload file'
    },
    classNames: {
      type: Object,
      default: {
        button: [],
        fileName: []
      }
    }
  },
  emits: ['change'],
  data() {
    return {
      fileName: '',
      errorMsg: ''
    }
  },
  methods: {
    // Handlers
    onClickButton(event) {
      this.$refs.inputFile.click()
    },
    onKeydownButton(event) {
      switch (event.key) {
        case 'Enter':
          this.$refs.inputFile.click()
          break
      }
    },
    onChangeInput(event) {
      if (!event.target.files.length) return

      this.clearErrorMsg()
      this.fileName = event.target.files[0].name
      this.$emit('change', event)
    },

    // Helpers
    showErrorMsg(msg) {
      this.fileName = ''
      this.errorMsg = msg
    },
    clearErrorMsg() {
      this.errorMsg = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/vars.scss';

.upload-file {
  display: inline-block;
}
.upload-file__button {
  display: inline-block;
  margin-right: 8px;
}
.upload-file__input {
  display: none;
}
.upload-file__file-name {
  font-size: 13px;
  color: #888;
}
.upload-file__error-msg {
  font-size: 13px;
  color: $colorRed;
}
</style>
