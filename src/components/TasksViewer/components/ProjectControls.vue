<template>
  <div class="project-controls">

    <button
      class="button button_type_icon-text button_color_red"
      :disabled="!hasCompletedTasks"
      @click="tasksStore.removeCompletedTasks"
    >
      <span>Clear</span>
      <Icon class="button__icon button__icon_stroke" name="backspace" />
    </button>

    <button
      class="button button_type_icon-text button_fill_violet"
      @click="openCreateTaskModal"
    >
      <span>Task</span>
      <Icon class="button__icon button__icon_stroke" name="plus" />
    </button>

    <Teleport to="#dialog">
      <CreateTaskModal
        v-if="isCreateTaskModalOpened"
        @confirm="onConfirmCreateTaskModal"
        @cancel="onCancelCreateTaskModal"
        @closed="destroyCreateTaskModal"
      />
    </Teleport>

    <Popup ref="menuRef">

      <template v-slot:opener>
        <button
          class="popup__opener button button_type_icon button_color_black"
          @click="toggleMenu"
        >
          <span>Menu</span>
          <Icon class="button__icon button__icon_stroke" name="menu" />
        </button>
      </template>

      <template v-slot:content>
        <ul class="popup__action-list">
          <li class="popup__action">
            <button
              class="popup__action-button button button_type_popup button_color_black"
              @click="openEditProjectModal(), closeMenu()"
            >
              <span>Rename</span>
              <Icon class="button__icon button__icon_fill" name="edit" />
            </button>
            <Teleport to="#dialog">
              <CreateProjectModal
                v-if="isEditListModalOpened"
                :name="projectsStore.openedProject.name"
                :icon="projectsStore.openedProject.icon"
                :edit="true"
                @confirm="onConfirmEditProjectModal"
                @cancel="onCancelEditProjectModal"
                @closed="destroyEditProjectModal"
              />
            </Teleport>
          </li>
          <li class="popup__action">
            <button
              class="popup__action-button button button_type_popup button_color_black"
              @click="openImportTasksModal(), closeMenu()"
              disabled
            >
              <span>Import</span>
              <Icon class="button__icon button__icon_stroke" name="upload" />
            </button>
          </li>
          <li class="popup__action">
            <button
              class="popup__action-button button button_type_popup button_color_black"
              @click="toggleProjectVisibility(), closeMenu()"
            >
              <span>{{ projectVisibilityBtnText }}</span>
              <Icon class="button__icon button__icon_fill" :name="projectVisibilityBtnIcon" />
            </button>
          </li>
          <div class="popup__divider"></div>
          <li v-if="hasTasks" class="popup__action">
            <button
              class="popup__action-button button button_type_popup button_color_red"
              @click="removeAllTasks(), closeMenu()"
            >
              <span>Delete all tasks</span>
              <Icon class="button__icon button__icon_fill" name="list-alternative" />
            </button>
          </li>
          <li class="popup__action">
            <button
              class="popup__action-button button button_type_popup button_color_red"
              @click="openDeleteListModal(), closeMenu()"
            >
              <span>Delete{{ tasksStore.filteredTasks.length ? ' project' : '' }}</span>
              <Icon class="button__icon button__icon_stroke" name="delete" />
            </button>
            <Teleport to="#dialog">
              <DeleteProjectModal
                v-if="isDeleteProjectModalOpened"
                @confirm="onConfirmDeleteProjectModal"
                @cancel="onCancelDeleteProjectModal"
                @closed="destroyDeleteProjectModal"
              />
            </Teleport>
          </li>
        </ul>
      </template>

    </Popup>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useConfirmDialog } from '@vueuse/core'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'

import CreateTaskModal from '@/components/modals/CreateTaskModal.vue'
import CreateProjectModal from '@/components/modals/CreateProjectModal.vue'
import DeleteProjectModal from '@/components/modals/DeleteProjectModal.vue'

// Data

const userStore = useUserStore()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const hasCompletedTasks = computed(() => !!tasksStore.tasks.find(task => task.done))
const hasTasks = computed(() => !!tasksStore.filteredTasks.length)

// Menu popup

const menuRef = ref(null)
const toggleMenu = () => menuRef.value.toggle()
const closeMenu = () => menuRef.value.close()

const toggleProjectVisibility = () => {
  const project = projectsStore.openedProject

  if (project.hidden) {
    projectsStore.showProject(project._id)
  } else {
    projectsStore.hideProject(project._id)
  }
}
const projectVisibilityBtnText = computed(() => projectsStore.openedProject.hidden ? 'show' : 'hide')
const projectVisibilityBtnIcon = computed(() => projectsStore.openedProject.hidden ? 'eye' : 'eye-off-filled')

const removeAllTasks = () => tasksStore.removeAllTasks(projectsStore.openedProject._id)

// Create task modal

const {
  reveal: openCreateTaskModal,
  cancel: onCancelCreateTaskModal,
  confirm: destroyCreateTaskModal,
  isRevealed: isCreateTaskModalOpened
} = useConfirmDialog()

const onConfirmCreateTaskModal = data => {
  projectsStore.createTask({ projectId: projectsStore.openedProject._id, ...data })
}

// Edit project modal

const {
  reveal: openEditProjectModal,
  cancel: onCancelEditProjectModal,
  confirm: destroyEditProjectModal,
  isRevealed: isEditListModalOpened
} = useConfirmDialog()

const onConfirmEditProjectModal = data => {
  projectsStore.updateProject({ id: projectsStore.openedProject._id, ...data })
}

// Delete list modal

const {
  reveal: openDeleteListModal,
  cancel: onCancelDeleteProjectModal,
  confirm: destroyDeleteProjectModal,
  isRevealed: isDeleteProjectModalOpened
} = useConfirmDialog()

const onConfirmDeleteProjectModal = () => {
  projectsStore.removeProject(projectsStore.openedProject._id)
}

</script>

<style lang="scss">
.project-controls {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-left: 6px;
}
</style>
