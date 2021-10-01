<template>
  <div class="lists-view">

    <div class="lists-view__header">
      <div class="lists-view__title title title_size_s">My lists</div>
      <button class="lists-view__add-button button button_type_text-icon button_icon_add"
        v-on:click="openModalAddList"
      >Add list</button>
    </div>

    <div class="lists-view__body scrollable-wrapper">
      <ul class="lists-view__ul scrollable-child">
        <list-item
          v-for="list in lists"
          v-bind:key="list.id"
          v-bind="list"
          v-bind:isActive="listIsOpened(list.id)"
        />
      </ul>
    </div>

    <modal ref="modalAddList">
      <form-add-list
        v-on:success="onSuccessFormAddList"
        v-on:cancel="closeModalAddList"
      ></form-add-list>
    </modal>

  </div>  
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ListItem from './ListItem.vue'
import FormAddList from './FormAddList.vue'

export default {
  name: 'lists-view',
  components: {
    ListItem,
    FormAddList
  },
  computed: {
    ...mapState([
      'lists'
    ]),
    ...mapGetters([
      'openedList'
    ])
  },
  methods: {
    openModalAddList() {
      this.$refs.modalAddList.open()
    },
    closeModalAddList() {
      this.$refs.modalAddList.close()
    },
    ...mapActions([
      'openList',
      'addList'
    ]),
    listIsOpened(id) {
      return id === this.openedList.id
    },
    onSuccessFormAddList(name) {
      this.addList(name)
      this.closeModalAddList()
    }
  }
}
</script>

<style scoped>
.lists-view {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  height: 100%;
  padding-top: 51px;

  position: relative;
}

.lists-view__header {
  height: 51px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  position: absolute;
  left: 0;
  top: 0;
}

.lists-view__ul {
  margin: 0;
  padding: 0;
}
</style>
