import { get, set, remove, findIndex } from 'lodash'
import check from 'check-types'

import { update } from '@/utils/helpers'
import db from '@/database'

const MAX_LIST_ORDER = 1000000

export default {
  // async setInitialData(data) {
  //   const { userId, showHiddenLists } = data
  //
  //   this.userId = userId
  //   this.showHiddenLists = showHiddenLists
  //
  //   const lists = await db.lists.find({ userId })
  //
  //   if (!lists.length) return
  //
  //   this.lists = [...lists]
  //
  //   this.updateTasksCounters()
  // },
  setUserId(id) {
    this.userId = id
  },
  setLists(lists) {
    this.lists = lists
    this.updateTasksCounters()
  },
  updateTasksCounters() {
    const tasksCounter = db.tasksCounter.exec()

    this.lists = this.lists.map(list => {
      const counters = tasksCounter.find(counter => counter.listId === list._id)

      return {
        ...list,
        tasksCount: {
          visible: counters.visible,
          hidden: counters.hidden
        }
      }
    })
  },
  async setShowHiddenLists(show) {
    this.showHiddenLists = show

    if (show || !this.openedList || !this.openedList.hidden) return

    const query = { _id: this.openedList._id }
    const modifier = { opened: false }

    update(this.lists, query, modifier)
    await db.lists.update(query, modifier)
  },
  async createList(options) {
    const isOptionsValid = check.all(check.map(options, {
      name: check.string && check.nonEmptyString,
      icon: check.string && check.nonEmptyString
    }))

    if (!isOptionsValid) throw new Error('Invalid list options!')

    const now = (new Date()).toISOString()
    const listOptions = {
      userId: this.userId,
      name: options.name,
      icon: options.icon,
      hidden: false,
      opened: false,
      order: this.lastOrder + 1,
      createdAt: now,
      modifiedAt: now,
      tags: []
    }

    await db.lists.insert(listOptions, res => {
      if (!res.inserted.length) throw new Error('List was not saved!')

      const list = res.inserted[0]

      this.lists.push(list)
      this.openList(list._id)
    })

    if (this.lastOrder >= MAX_LIST_ORDER) await this.reorderLists()
  },
  async updateList(options) {
    const isOptionsValid = check.all(check.map(options, {
      id: check.string && check.nonEmptyString,
      name: check.string && check.nonEmptyString,
      icon: check.string && check.nonEmptyString
    }))

    if (!isOptionsValid) throw new Error('Invalid list options!')

    const query = { _id: options.id }
    const modifier = {
      name: options.name,
      icon: options.icon
    }

    update(this.lists, query, modifier)
    await db.lists.update(query, modifier)
  },
  async swapLists(movedLists = []) {
    if (movedLists.length < 2) throw new Error('Error lists moving!')

    const [listIdA, listIdB] = movedLists
    const listA = this.lists.find(list => list._id === listIdA)
    const listB = this.lists.find(list => list._id === listIdB)

    const prevOrderA = listA.order
    const prevOrderB = listB.order

    listA.order = prevOrderB
    listB.order = prevOrderA

    await db.lists.update({ _id: listIdA }, { order: prevOrderB })
    await db.lists.update({ _id: listIdB }, { order: prevOrderA })
  },
  async openList(newListId) {
    const prevListId = get(this.openedList, '_id', null)

    if (prevListId) this.openedList.opened = false

    const newOpenedList = this.lists.find(item => item._id === newListId)

    newOpenedList.opened = true

    if (prevListId) await db.lists.update({ _id: prevListId }, { opened: false })
    await db.lists.update({ _id: newListId }, { opened: true })
  },
  async openClosestList(id) {
    const isIdInvalid = check.string(id) && check.nonEmptyString(id)

    if (!isIdInvalid) throw new Error('List id is invalid!')

    const index = findIndex(this.lists, list => list._id === id)
    const prevList = this.lists[index - 1]
    const nextList = this.lists[index + 1]
    const closestListId = nextList ? nextList._id : (
      prevList ? prevList._id : null
    )

    if (closestListId) await this.openList(closestListId)
  },
  async toggleListVisibility(id) {
    const isIdInvalid = check.string(id) && check.nonEmptyString(id)

    if (!isIdInvalid) throw new Error('List id is invalid!')

    const list = this.lists.find(list => list._id === id)
    const query = { _id: id }
    const modifier = { hidden: !list.hidden, opened: this.showHiddenLists }

    // update store

    if (!this.showHiddenLists) await this.openClosestList(id)

    update(this.lists, query, modifier)

    // update db

    await db.lists.update(query, modifier)
  },
  async removeList(id) {
    const isIdInvalid = check.string(id) && check.nonEmptyString(id)

    if (!isIdInvalid) throw new Error('List id is invalid!')

    // update store

    await this.openClosestList(id)

    this.lists = this.lists.filter(list => list._id !== id)

    // update db

    await db.lists.remove({ _id: id })
  },
  async reorderLists() {
    let newOrder = 0
    for (const list of this.sortedListsByOrder) {
      const query = { _id: list._id }
      const modifier = { order: ++newOrder }

      update(this.lists, query, modifier)

      await db.lists.update(query, { order: newOrder })
    }
  }
}
