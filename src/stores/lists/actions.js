import { get, set } from 'lodash'
import check from 'check-types'

import db from '@/database'
import { DEFAULT_LIST_ICON } from '@/js/static/listIcons.js'

export default {
  async setInitialData(data) {
    const { userId } = data

    this.userId = userId

    const lists = await db.lists.find({ userId })

    console.log(lists.length)

    if (lists.length) {
      this.lists = [...lists]
      this.openedListId = get(this.lists.find(item => item.opened), '_id', null)
      return
    }

    await this.createDefaultList()
  },
  async createDefaultList() {
    const DEFAULT_LIST_OPTIONS = {
      userId: this.userId,
      name: 'Main',
      icon: DEFAULT_LIST_ICON,
      hidden: false,
      opened: true,
      order: 1
    }

    await db.lists.insert(DEFAULT_LIST_OPTIONS, res => {
      if (!res.inserted.length) throw new Error('Create default list ERROR')

      const list = res.inserted[0]

      this.lists.push(list)
      this.openedListId = list._id
    })
  },
  async createList(options) {
    check.object(options, {
      name: String,
      icon: String
    })

    const LIST_OPTIONS = {
      userId: this.userId,
      name: options.name,
      icon: options.icon,
      hidden: false,
      opened: false,
      order: 1
    }

    await db.lists.insert(LIST_OPTIONS, res => {
      if (!res.inserted.length) throw new Error('Create default list ERROR')

      const list = res.inserted[0]
      this.lists.push(list)
      this.openList(list._id)
    })
  },
  updateList(options) {

  },
  removeList(id) {

  },
  swapLists(movedListA, movedListB) {

  },
  async openList(newListId) {
    const prevListId = this.openedListId

    this.openedList.opened = false
    this.openedListId = newListId

    const newOpenedList = this.lists.find(item => item._id === newListId)
    newOpenedList.opened = true

    await db.lists.update({ _id: prevListId }, { opened: false })
    await db.lists.update({ _id: newListId }, { opened: true })
  },
  async hideList(id) {
    const list = this.lists.find(item => item._id === id)

    list.hidden = true

    await db.lists.update({ _id: id }, {
      hidden: true
    })
  },
  async showList(id) {
    const list = this.lists.find(item => item._id === id)

    list.hidden = false

    await db.lists.update({ _id: id }, {
      hidden: false
    })
  }
}
