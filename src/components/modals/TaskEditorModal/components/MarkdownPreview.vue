<template>
  <div class="markdown-preview">

    <div>Markdown Preview</div>

  </div>
</template>

<script setup>

</script>

<style lang="scss">
@import '@/assets/scss/env';

.markdown-preview {
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  background-color: get-light($bgColor, 'main');
  border-right: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
}
</style>
