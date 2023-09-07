<template>
  <div class="lists-view">

    <div class="lists-view__header">
      <div class="lists-view__title title title_size_m">My lists</div>
      <button
        class="lists-view__add-button button button_type_icon-text"
        @click="openCreateListModal"
      >
        <span>List</span>
        <Icon class="button__icon button__icon_stroke" name="plus" />
      </button>
    </div>

    <div class="lists-view__body scrollable-wrapper">
      <ul
        class="lists-view__ul scrollable-child"
        ref="listsRef"
      >
        <TransitionGroup name="flip-list" :css="false">
          <List
            v-for="list of sortedListsByOrder"
            :key="list._id"
            :data-swap-id="list._id"
            :id="list._id"
            :name="list.name"
            :icon="list.icon"
            :opened="list.opened"
          />
        </TransitionGroup>
      </ul>
    </div>

    <teleport to="#dialog">
      <CreateListModal
        v-if="isCreateListModalOpened"
        @confirm="onConfirmCreateListModal"
        @cancel="onCancelCreateListModal"
        @closed="destroyCreateListModal"
      />
    </teleport>

  </div>  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useConfirmDialog } from "@vueuse/core"

import Swapper from '@/utils/swapper'
import { useListsStore } from '@/stores/lists'
import CreateListModal from '@/components/modals/CreateListModal.vue'
import List from './List.vue'

const listsStore = useListsStore()

const sortedListsByOrder = computed(() => {
  return [...listsStore.lists].sort((a, b) => a.order - b.order)
})

// Create list modal

const {
  reveal: openCreateListModal,
  cancel: onCancelCreateListModal,
  confirm: destroyCreateListModal,
  isRevealed: isCreateListModalOpened
} = useConfirmDialog()

const onConfirmCreateListModal = (data) => {
  listsStore.createList(data)
}

// Swapping lists

const listsRef = ref(null)
const listsSwapper = new Swapper()

onMounted(() => {
  listsSwapper.init(listsRef.value, 300)
  listsSwapper.onFirstSelected(listsStore.openList)
  listsSwapper.onReady(listsStore.swapLists)
})

onBeforeUnmount(() => {
  listsSwapper.destroy()
})

</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.lists-view {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  height: 100%;
  padding-top: 44px;

  position: relative;
}
.lists-view__header {
  height: 44px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0 12px;
  position: absolute;
  left: 0;
  top: 0;
}
.lists-view__body {
  position: relative;
}
.lists-view__ul {
  margin: 0;
  padding: 0;
}
.lists-view__scroll-trigger {
  width: 100%;
  height: 10px;
  display: none;
  position: absolute;  
  left: 50%;
  transform: translateX(-50%);
  background-color: $transparent;
  z-index: 10;
}
.lists-view__scroll-trigger_active {
  display: block;
}
.lists-view__scroll-trigger_top {
  top: 0;
}
.lists-view__scroll-trigger_bottom {
  bottom: 0;
}
.flip-list-move {
  transition: transform .3s ease;
}
</style>
