import { get, set } from 'lodash'
import check from 'check-types'

import db from '@/database'
import { DEFAULT_LIST_ICON } from '@/js/static/listIcons.js'

export default {
  async setInitialData(data) {
    const { userId } = data

    this.userId = userId

    const lists = await db.lists.find({ userId })

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
      order: this.lastOrder + 1
    }

    await db.lists.insert(DEFAULT_LIST_OPTIONS, res => {
      if (!res.inserted.length) throw new Error('Create default list ERROR')

      const list = res.inserted[0]

      this.lists.push(list)
      this.openedListId = list._id
    })
  },
  async createList(options) {
    const isOptionsValid = check.all(check.map(options, {
      name: check.string && check.nonEmptyString,
      icon: check.string && check.nonEmptyString
    }))

    if (!isOptionsValid) throw new Error('Invalid data')

    const LIST_OPTIONS = {
      userId: this.userId,
      name: options.name,
      icon: options.icon,
      hidden: false,
      opened: false,
      order: this.lastOrder + 1
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
  async swapLists(movedLists = []) {
    if (movedLists.length < 2) throw new Error('Swap lists ERROR')

    const [listIdA, listIdB] = movedLists
    const listA = this.lists.find(list => list._id === listIdA)
    const listB = this.lists.find(list => list._id === listIdB)

    const prevOrderA = listA.order
    const prevOrderB = listB.order

    listA.order = prevOrderB
    listB.order = prevOrderA

    // Save to db

    await db.lists.update({ _id: listIdA }, { order: prevOrderB })
    await db.lists.update({ _id: listIdB }, { order: prevOrderA })
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
