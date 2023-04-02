<template>
  <form class="form form-import"
    v-on:submit.prevent
  >
    <div class="form__header">
      <div class="form__title title title_size_l">Import tasks</div>
      <div class="form__desc text text_color_gray">Upload the file of tasks in <span class="text_weight_bold text_color_primary">json</span> format and select the required items</div>
      <button class="form__cancel-button button button_type_icon button_color_black"
        v-on:click="emitCancel"
      >
        <span>Cancel</span>
        <svg class="button__icon button__icon_fill">
          <use xlink:href="#close"></use>
        </svg>
      </button>
    </div>

    <div class="form__body">

      <div class="form-import__multiple-row form__row form__row_input">

        <upload-file
          class="form-import__upload form__control-button"
          ref="uploadFile"
          v-on:change="getData"
        ></upload-file>

        <div class="form-import__col form-import__selector">
          <div
            class="form-import__select"
            :class="selectorClasses"
            @click="onToggleSelector"
            tabindex="1"
          >
            <svg class="form-import__select-icon">
              <use xlink:href="#check-bold"></use>
            </svg>
          </div>
          <span class="form-import__input-text text text_color_gray">Select all</span>
        </div>

        <div class="form-import__col">
          <checkbox
            class="auto-mode__checkbox"
            :checked="isAutoMode"
            @change="onToggleAutoMode"
          ></checkbox>
          <span class="form-import__input-text text text_color_gray">Insert to associated lists</span>
        </div>

      </div>

      <div class="form__row form__row_input">

        <div class="select-todos">
          <div class="select-todos__list"
            v-for="list of renderedLists"
            v-bind:key="list.id"
          >

            <div class="select-todos__list-name">{{ list.name }} ({{ list.todos.length }})</div>
            <ul class="select-todos__items-list">
              <li class="select-todos__item"
                v-for="todo of list.todos"
                v-bind:key="todo.id"
              >
                <div class="select-todos__item-select">
                  <label class="select-todos__checker">
                    <input type="checkbox" class="select-todos__checkbox"
                      v-bind:checked="todo.isSelected"
                      v-on:change="onToggleTodo($event, list.id, todo.id)"
                    >
                    <svg class="select-todos__check-icon">
                      <use xlink:href="#check"></use>
                    </svg>
                  </label>
                </div>
                <div class="select-todos__item-content">
                  <div class="select-todos__inner-row select-todos__inner-row_between">
                    <div class="select-todos__item-name">{{ todo.name }}</div>
                    <div class="select-todos__item-icons">
                      <svg class="select-todos__item-hidden-status"
                        v-show="todo.hidden"
                      >
                        <use xlink:href="#eye-slash"></use>
                      </svg>
                      <svg class="select-todos__item-priority"
                        v-bind:class="priorityClassName(todo)"
                      >
                        <use xlink:href="#flag"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="select-todos__inner-row">
                    <pre class="select-todos__item-notes">{{ todo.notes }}</pre>
                  </div>
                </div>
              </li>

            </ul>

          </div>
        </div>

      </div>

      <div class="form-import__controls form__row form__row_controls">
        <button
          class="form__control-button form__control-button_scale_min button button_fill_violet"
          :disabled="isSubmitButtonDisabled"
          @click="emitSuccess"
        >Import</button>
      </div>
    </div>

  </form>
</template>

<script>
import { catchFocus, execWhenShiftEnter } from '@/js/focusForm'
import { isValidImportedLists } from '@/js/isValidImportedLists'
import { flat } from '@/js/helpers'

export default {
  name: 'form-import-todos',
  emits: ['success', 'cancel'],
  prop: {
    listId: String
  },
  data() {
    return {
      renderedLists: [],
      isAutoMode: false,
    }
  },
  computed: {
    allTodos() {
      return flat(this.renderedLists.map(list => {
        return list.todos.map(todo => {
          return {
            isSelected: todo.isSelected,
            listName: todo.listName,
            name: todo.name,
            notes: todo.notes,
            priority: todo.priority,
            hidden: todo.hidden
          }
        })
      }))
    },
    selectedTodos() {
      return this.allTodos.filter(todo => todo.isSelected)
    },
    isSelectedAll() {
      if (this.allTodos.length === 0) return false

      return this.allTodos.length === this.selectedTodos.length
    },
    isSelectedPartly() {
      return !this.isSelectedAll && this.selectedTodos.length > 0
    },
    isSubmitButtonDisabled() {
      return !this.selectedTodos.length
    },
    selectorClasses() {
      return {
        'form-import__select_all': this.isSelectedAll,
        'form-import__select_partly': this.isSelectedPartly,
        'form-import__select_disabled': this.allTodos.length === 0
      }
    }
  },
  methods: {
    getData(event) {
      const file = event.target.files[0]
      const fileExtension = file.name.split('.').slice(-1)[0]

      // Show message about invalid file format
      if (fileExtension !== 'json') {
        this.$refs.uploadFile.showErrorMsg('Invalid file format')
        this.clear()
        return
      }

      new Response(file).json().then(json => {
        // Show message about invalid data
        if (!isValidImportedLists(json)) {
          this.$refs.uploadFile.showErrorMsg('Invalid data')
          this.clear()
          throw new Error('Invalid data')
        }

        // Set...
        this.renderedLists = json.map(list => {
          return {
            ...list,
            todos: list.todos.map(todo => {
              return {
                ...todo,
                listName: list.name,
                isSelected: false
              }
            })
          }
        })
      }, err => {
        console.warn(err)
      })
    },

    emitSuccess() {
      this.$emit('success', this.selectedTodos, this.isAutoMode)
    },
    emitCancel() {
      this.$emit('cancel')
    },
    onToggleTodo(event, listId, todoId) {
      const list = this.renderedLists.find(list => list.id === listId)
      const todo = list.todos.find(todo => todo.id === todoId)

      todo.isSelected = !todo.isSelected
    },
    onToggleSelector() {
      if (this.isSelectedPartly || this.isSelectedAll) {
        this.renderedLists.forEach(list => list.todos.forEach(todo => todo.isSelected = false))
      } else {
        this.renderedLists.forEach(list => list.todos.forEach(todo => todo.isSelected = true))
      }
    },
    onToggleAutoMode() {
      this.isAutoMode = !this.isAutoMode
    },

    // Helpers
    clear() {
      this.renderedLists = []
    },
    priorityClassName(todo) {
      if (!todo.priority) return ''

      return `select-todos__item-priority_visible select-todos__item-priority_${ todo.priority.toLowerCase() }`
    }
  },
  mounted() {
    this.removeShiftEnter = execWhenShiftEnter(this.emitSuccess)

    catchFocus(this.$el)
  },
  beforeUnmount() {
    this.removeShiftEnter()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.form-import {
  width: 100%;
  max-width: 720px;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  &__multiple-row {
    display: flex;
    justify-content: space-between;
  }

  &__upload {
    margin: 0;
    padding: 0;
  }
}

.form-import__selector {
  margin-left: auto;
}

.form-import__select {
  width: 16px;
  height: 16px;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
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

  &::after {
    content: '';
    display: block;
    width: 8px;
    height: 2px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    background-color: #fff;
    border-radius: 1px;
    opacity: 0;
    transition: transform .15s ease, opacity .15s ease;
  }

  &-icon {
    width: 10px;
    height: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    stroke: #fff;
    opacity: 0;
    transition: transform .15s ease, opacity .15s ease;
  }

  &_all::before,
  &_partly::before {
    background-color: $primaryColor;
    border: 1px solid $primaryColor;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, .15);
  }

  &_all .form-import__select-icon {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  &_partly::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  &_disabled {
    opacity: .5;
    pointer-events: none;
    cursor: default;
  }

  &_disabled ~ .form-import__input-text {
    opacity: .5;
  }
}

.form-import__col {
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    margin-right: 20px;
  }
}

.form-import__input-text {
  margin-left: 8px;
  font-size: 12px;
  line-height: 1em;
}

.select-todos {
  height: 100%;
  min-height: 200px;
  max-height: 420px;
  margin-top: 12px;
  background-color: #f9f9f9;
  border: 1px solid #f5f5f5;
  border-radius: 6px;
  overflow-y: auto;
}

.select-todos__list {
  padding: 12px;
  border-radius: 6px;
}

.select-todos__list-name {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
}

.select-todos__items-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.select-todos__item {
  padding: 8px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
}

.select-todos__inner-row {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-items: stretch;
}

.select-todos__inner-row_between {
  justify-content: space-between;
}

.select-todos__items-list > .select-todos__item:not(:last-child) {
  margin-bottom: 6px;
}

.select-todos__item-select {
  margin-right: 12px;
}

.select-todos__checker {
  display: block;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.select-todos__checkbox {
  display: none;
}

.select-todos__check-icon {
  display: block;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: $gray;
}

.select-todos__checkbox:checked + .select-todos__check-icon {
  stroke: $green;
}

.select-todos__item-content {
  width: 100%;
}

.select-todos__item-name {
  width: 100%;
  margin-right: 12px;
  font-size: 13px;
  font-weight: bold;
  word-break: break-word;
}

.select-todos__item-notes {
  margin: 0;
  font-family: $fontMain;
  font-size: 12px;
  color: #888;
  word-break: break-word;
  white-space: pre-wrap;
}

.select-todos__item-icons {
  display: flex;
  align-items: center;
  height: 20px;
}

.select-todos__item-hidden-status {
  display: block;
  width: 16px;
  height: 16px;
  opacity: .4;
  pointer-events: none;
}

.select-todos__item-priority {
  display: none;
  width: 16px;
  height: 16px;
  margin-left: 8px;

  &_visible { display: block; }

  &_low {
    fill: get-light($taskPriorityBgColor, 'low');
  }

  &_middle {
    fill: get-light($taskPriorityBgColor, 'middle');
  }

  &_high {
    fill: get-light($taskPriorityBgColor, 'high');
  }
}

// Dark theme

.app_theme_dark {

  .form-import__select::before {
    background-color: get-dark($bgColor, 'main');
    border: 1px solid get-dark($formBorderColor);
  }

  .form-import__select_all::before,
  .form-import__select_partly::before {
    background-color: $primaryColor;
    border: 1px solid $primaryColor;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, .15);
  }

  .select-todos {
    background-color: get-dark($bgColor, 'main');
    border: 1px solid get-dark($formBorderColor);
  }

  .select-todos__list-name {
    color: get-dark($baseTextColor);
  }

  .select-todos__item {
    background-color: darken(get-dark($bgColor, 'main'), 6%);
    border: 1px solid get-dark($formBorderColor);
  }

  .select-todos__item-name {
    color: get-dark($baseTextColor);
  }

  .select-todos__item-notes {
    color: get-dark($secondaryTextColor);
  }

  .select-todos__item-hidden-status {
    fill: #fff;
    opacity: .6;
  }
}

</style>
