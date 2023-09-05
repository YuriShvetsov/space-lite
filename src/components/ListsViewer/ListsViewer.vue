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

      <div
        class="lists-view__scroll-trigger lists-view__scroll-trigger_top"
        ref="topScrollTrigger"
      ></div>
      <div
        class="lists-view__scroll-trigger lists-view__scroll-trigger_bottom"
        ref="bottomScrollTrigger"
      ></div>

      <ul
        class="lists-view__ul scrollable-child"
        ref="lists"
      >
<!--        <transition-group name="flip-list" :css="false">-->
<!--          <list-item-->
<!--            v-for="list in lists"-->
<!--            v-bind:key="list.id"-->
<!--            v-bind:data-id="list.id"-->
<!--            v-bind="list"-->
<!--            v-bind:isActive="listIsOpened(list.id)"-->
<!--            v-on:start-moving="onStartListMoving"-->
<!--            v-on:mouseover="setHoverList(list.id)"-->
<!--            v-on:mouseout="unsetHoverList"-->
<!--          />-->
<!--        </transition-group>-->

        <transition-group name="flip-list" :css="false">
          <List
            v-for="list of listsStore.lists"
            :key="list._id"
            :id="list._id"
            :name="list.name"
            :icon="list.icon"
            :opened="list.opened"
          />
        </transition-group>
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
import { useConfirmDialog } from "@vueuse/core"

import { useListsStore } from '@/stores/lists'
import CreateListModal from '@/components/modals/CreateListModal.vue'
import List from './List.vue'

const listsStore = useListsStore()

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
