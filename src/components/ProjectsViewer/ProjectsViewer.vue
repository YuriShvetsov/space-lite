<template>
  <div class="projects-viewer">

    <div class="projects-viewer__header">
      <div class="projects-viewer__title title title_size_m">My projects</div>
      <button
        class="projects-viewer__add-button button button_type_icon-text"
        @click="openCreateProjectModal"
      >
        <span>New</span>
        <Icon class="button__icon button__icon_stroke" name="plus" />
      </button>
    </div>

    <div class="projects-viewer__body scrollable-wrapper">
      <ul class="projects-viewer__ul scrollable-child" ref="projectsRef">
        <TransitionGroup name="flip-list" :css="false">
          <Project
            v-for="project of projectsStore.availableProjects"
            :key="project._id"
            :data-swap-id="project._id"
            :id="project._id"
            :name="project.name"
            :icon="project.icon"
            :opened="project.opened"
            :hidden="project.hidden"
            :tasks-counter="project.tasksCounter"
          />
        </TransitionGroup>
      </ul>
    </div>

    <Teleport to="#dialog">
      <CreateProjectModal
        v-if="isCreateProjectModalOpened"
        @confirm="onConfirmCreateProjectModal"
        @cancel="onCancelCreateProjectModal"
        @closed="destroyCreateProjectModal"
      />
    </Teleport>

  </div>  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useConfirmDialog } from "@vueuse/core"

import Swapper from '@/utils/swapper'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'

import CreateProjectModal from '@/components/modals/CreateProjectModal.vue'
import Project from './components/Project.vue'

// Data

const userStore = useUserStore()
const projectsStore = useProjectsStore()

// Create project modal

const {
  reveal: openCreateProjectModal,
  cancel: onCancelCreateProjectModal,
  confirm: destroyCreateProjectModal,
  isRevealed: isCreateProjectModalOpened
} = useConfirmDialog()

const onConfirmCreateProjectModal = (data) => {
  projectsStore.createProject(data)
}

// Projects moving

const projectsRef = ref(null)
const projectsSwapper = new Swapper()

onMounted(() => {
  projectsSwapper.init(projectsRef.value, 300)
  projectsSwapper.onFirstSelected(projectsStore.openProject)
  projectsSwapper.onReady(projectsStore.moveProjects)
})

onBeforeUnmount(() => {
  projectsSwapper.destroy()
})

</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.projects-viewer {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  height: 100%;
  padding-top: 44px;

  position: relative;
}

.projects-viewer__header {
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

.projects-viewer__body {
  position: relative;
}

.projects-viewer__ul {
  margin: 0;
  padding: 0;
}

.projects-viewer__scroll-trigger {
  width: 100%;
  height: 10px;
  display: none;
  position: absolute;  
  left: 50%;
  transform: translateX(-50%);
  background-color: $transparent;
  z-index: 10;
}

.projects-viewer__scroll-trigger_active {
  display: block;
}

.projects-viewer__scroll-trigger_top {
  top: 0;
}

.projects-viewer__scroll-trigger_bottom {
  bottom: 0;
}

.flip-list-move {
  transition: transform .3s ease;
}
</style>
