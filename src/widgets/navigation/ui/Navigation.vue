<template>
  <nav class="navigation">
    <div class="navigation__group">
      <Button
        v-for="(tab) of topTabs"
        :key="tab.name"
        class="navigation__item"
        :class="getItemClasses(tab)"
        tag="a"
        :href="tab.url"
        :icon="tab.icon"
        :disabled="tab.isDisabled"
      />
    </div>
    <div class="navigation__group">
      <Button
        v-for="(tab) of bottomTabs"
        :key="tab.name"
        class="navigation__item"
        :class="getItemClasses(tab)"
        tag="a"
        :href="tab.url"
        :icon="tab.icon"
        :disabled="tab.isDisabled"
      />
    </div>
  </nav>
</template>

<script setup>
import { Button } from '@yurishvetsov/space-ui'

import { useNavigationStore } from '../model'

const { tabs, activeTab } = useNavigationStore()
const topTabs = tabs.filter((tab) => tab.group === 'top')
const bottomTabs = tabs.filter((tab) => tab.group === 'bottom')

const getItemClasses = (tab) => {
  return {
    navigation__item_active: tab.url === activeTab.url
  }
}

</script>

<style lang="scss" scoped>
.navigation {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 12px;
  position: fixed;
  left: 0;
  top: 0;

  border-right: 1px solid #d3d3d3;
}

.navigation__group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.navigation__item {
 color: $color-text-base;
}

.navigation__item_active {
  color: $color-primary;
  background-color: lighten($color-primary, 45%);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.12);

  &:hover {
    color: $color-primary;
    background-color: lighten($color-primary, 45%);
  }
}

</style>
