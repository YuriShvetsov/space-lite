<template>
  <div class="dev page">
    <header class="dev__header">
      <div class="dev__header-wrapper container">
        <h1 class="dev__header-title">Development</h1>
      </div>
    </header>
    <main class="dev__main main">
      <section class="dev__section">
        <div class="dev__link-list">
          <a href="/" class="dev__link">Home</a>
          <a href="/dev/ui" class="dev__link">UI</a>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.dev__header {
  width: 100%;
  height: 65px;
  position: fixed;
  top: 0;
  z-index: 10;

  background-color: #fff;
  border-bottom: 1px solid #dcdcdc;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
}

.dev__header-title {
  font-size: 24px;
  font-weight: bold;
}

.dev__header-wrapper {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
}

.dev__link-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dev__link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  height: 32px;
  margin: 0 auto;
  padding: 16px;

  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: #456eea;

  background-color: transparent;
  border-radius: 6px;
  transition: background-color $base-transition;

  &:hover {
    text-decoration: none;
    background-color: #f3f6ff;
  }
}

.dev__main {
  padding: 73px 0 8px;
}

.dev__section {
  margin: 36px 0;
}

.dev__section-title {
  margin-bottom: 4px;
  font-size: 20px;
  font-weight: 800;
}

.dev__section-description {
  font-size: 16px;
  color: #535353;
}

</style>
