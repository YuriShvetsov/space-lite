<template>
  <form class="form form-import"
    v-on:submit.prevent
  >
    <div class="form__header">
      <div class="form__title title title_size_l">Import tasks</div>
      <div class="form__desc text text_color_gray">Upload the file of tasks in <span class="text_weight_bold">json</span> format and select the required items</div>
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

      <div class="form__row form__row_input">
        <upload-file
          class="form-import__upload form__control-button"
          ref="uploadFile"
          v-on:change="getData"
        ></upload-file>
      </div>

      <div class="form__row form__row_input">

        <div class="select-todos">
          <div class="select-todos__list"
            v-for="list of importedTodos"
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
                      v-on:change="onToggleTodo($event, todo.id)"
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
          v-bind:disabled="!selectedTodos.length"
          v-on:click="emitSuccess"
        >Import</button>
      </div>
    </div>

  </form>
</template>

<script>
import { catchFocus } from '../js/focusForm'
import { isValidImportedTodos } from '../js/isValidImportedTodos'

export default {
  name: 'form-import-todos',
  emits: ['success', 'cancel'],
  prop: {
    listId: String
  },
  data() {
    return {
      importedTodos: [],
      renderedTodos: []
    }
  },
  computed: {
    selectedTodos() {
      return this.renderedTodos.filter(todo => todo.isSelected).map(todo => {
        return {
          name: todo.name,
          notes: todo.notes,
          priority: todo.priority,
          hidden: todo.hidden
        }
      })
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
        if (!isValidImportedTodos(json)) {
          this.$refs.uploadFile.showErrorMsg('Invalid data')
          this.clear()
          throw new Error('Invalid data')
        }

        // Set...
        this.importedTodos = json.filter(list => list.todos.length > 0)
        this.renderedTodos = this.importedTodos.reduce((acc, list) => {
          acc = acc.concat(...list.todos.map(todo => {
            return {
              id: todo.id,
              isSelected: false,
              name: todo.name,
              notes: todo.notes,
              priority: todo.priority,
              hidden: todo.hidden
            }
          }))
          return acc
        }, [])
      }, err => {
        console.warn(err)
      })
    },

    emitSuccess() {
      this.$emit('success', this.selectedTodos)
    },
    emitCancel() {
      this.$emit('cancel')
    },
    onToggleTodo(event, todoId) {
      const todo = this.renderedTodos.find(todo => todo.id === todoId)

      todo.isSelected = !todo.isSelected
    },

    // Helpers
    clear() {
      this.importedTodos = []
      this.renderedTodos = []
    },
    priorityClassName(todo) {
      if (!todo.priority) return ''

      return `select-todos__item-priority_visible select-todos__item-priority_${ todo.priority.toLowerCase() }`
    }
  },
  mounted() {
    catchFocus(this.$el)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/env';

.form-import {
  width: 100%;
  max-width: 720px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-import__upload {
  margin: 0 auto;
  padding: 0;
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
  font-size: 16px;
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
