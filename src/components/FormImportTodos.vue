<template>
  <form class="form form-import"
    v-on:submit.prevent
  >
    <div class="form__header">
      <div class="form__title title title_size_s title_color_violet">Import of tasks</div>
    </div>

    <div class="form__body">
      
      <div class="form__row">
        <label class="form__label">
          <span class="form__label-name">Choose file json</span>
          <upload-file
            class="form-import__upload"
            v-on:change="getData"
            ref="uploadFile"
          ></upload-file>
        </label>
      </div>

      <div class="form__row">

        <div class="select-todos">
          <div class="select-todos__list"
            v-for="list of importedTodos"
            v-bind:key="list.id"
          >

            <div class="select-todos__list-name">{{ list.name }}</div>
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
                    <div class="select-todos__checkmark"></div>
                  </label>
                </div>
                <div class="select-todos__item-content">
                  <div class="select-todos__inner-row select-todos__inner-row_between">
                    <div class="select-todos__item-name">{{ todo.name }}</div>
                    <div class="select-todos__item-priority"
                      v-bind:class="priorityClassName(todo.priority)"
                    >{{ todo.priority }}</div>
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

      <div class="form__row form__row_controls">
        <button
          class="form__control-button button button_type_submit"
          v-on:click="emitSuccess"
        >OK</button>
        <button
          class="form__control-button button"
          v-on:click="emitCancel"
        >Cancel</button>
      </div>
    </div>

  </form>
</template>

<script>
const { isValidImportedTodos } = require('../js/isValidImportedTodos')

export default {
  name: 'form-import-todos',
  emits: ['success', 'cancel'],
  prop: {
    listId: String
  },
  data() {
    return {
      importedTodos: [],
      selectedTodos: []
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
        this.selectedTodos = this.importedTodos.reduce((acc, list) => {
          acc = acc.concat(...list.todos.map(todo => {
            return {
              id: todo.id,
              isSelected: false,
              name: todo.name,
              notes: todo.notes,
              priority: todo.priority
            }
          }))
          return acc
        }, [])
      }, err => {
        console.warn(err)
      })
    },

    emitSuccess() {
      this.$emit('success', this.selectedTodos.filter(todo => todo.isSelected).map(todo => {
        return {
          name: todo.name,
          notes: todo.notes,
          priority: todo.priority
        }
      }))
    },
    emitCancel() {
      this.$emit('cancel')
    },
    onToggleTodo(event, todoId) {
      const todo = this.selectedTodos.find(todo => todo.id === todoId)

      todo.isSelected = !todo.isSelected
    },

    //Helpers
    clear() {
      this.importedTodos = []
      this.selectedTodos = []
    },
    priorityClassName(priority) {
      return `select-todos__item-priority_${ priority.toLowerCase() }`
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/utils/vars.scss';

.form-import {
  width: 100%;
  max-width: 720px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.form-import__upload {
  margin: 0 8px;
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
  cursor: pointer;
}
.select-todos__checkbox {
  display: none;
}
.select-todos__checkmark {
  width: 18px;
  height: 18px;
  position: relative;
  background: #fff;
  border: 2px solid #e4e4ee;
  border-radius: 50%;
  overflow: hidden;
}
.select-todos__checkmark::before {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%) scale(1.5);
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 3px rgba(0, 0, 0, .2);
  opacity: 0;
  z-index: map-get($zLayers, "zIndexPage") + 1;
}
.select-todos__checkbox:checked ~ .select-todos__checkmark {
  background-color: unset;
  background: linear-gradient(#f16377,#ed344e);
  border: none;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, .2);
}
.select-todos__checkbox:checked ~ .select-todos__checkmark::before {
  transform: translate(-50%,-50%) scale(1);
  opacity: 1;
  transition: transform .15s ease-in-out;
}
.select-todos__item-content {
  width: 100%;
}
.select-todos__item-name {
  width: calc(100% - 60px);
  font-size: 14px;
  font-weight: bold;
  word-break: break-word;
}
.select-todos__item-notes {
  margin: 0;
  font-family: $font_main;
  font-size: 13px;
  color: #888;
  word-break: break-word;
  white-space: pre-wrap;
}
.select-todos__item-priority {
  padding: 2px 7px;
  font-size: 10px;
  text-transform: uppercase;
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.02);
}
.select-todos__item-priority_low {
  color: lighten($colorGreenCold, 10%);
  background-color: lighten($colorGreenCold, 48%);
}
.select-todos__item-priority_middle {
  color: lighten($colorBlue, 10%);
  background-color: lighten($colorBlue, 40%);
}
.select-todos__item-priority_high {
  color: lighten($colorRed, 10%);
  background-color: lighten($colorRed, 40%);
}

</style>
