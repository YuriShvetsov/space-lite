import { get, remove } from 'lodash'
import check from 'check-types'

import db from '@/database'

import { update } from '@/utils/helpers'

const MAX_LIST_ORDER = 1000000

export default {
  async setInitialData(data) {
    const { userId, list, showHiddenTasks } = data

    this.userId = userId
    this.showHiddenTasks = showHiddenTasks

    await this.setList(list)
  },
  async setList(list) {
    this.list = list

    const tasks = await db.tasks.find({ userId: this.userId, listId: list._id })
    this.tasks = [...tasks]
    this.tasksCount = list.tasksCount
  },
  setShowHiddenTasks(value) {
    this.showHiddenTasks = value
  },
  async createTask(options) {
    if (!this.userId) throw new Error('Invalid user data!')

    const isOptionsValid = check.all(check.map(options, {
      name: check.string && check.nonEmptyString,
      description: check.string,
      priority: check.string,
      tags: check.array
    }))

    if (!isOptionsValid) throw new Error('Invalid task options!')

    const now = (new Date()).toISOString()
    const taskOptions = {
      userId: this.userId,
      listId: this.list._id,
      done: false,
      name: options.name,
      description: options.description,
      notes: [],
      priority: options.priority,
      tags: options.tags,
      hidden: false,
      createdAt: now,
      modifiedAt: now,
      order: this.lastOrder + 1
    }

    await db.tasks.insert(taskOptions, res => {
      if (!res.inserted.length) throw new Error('List was not saved!')

      const task = res.inserted[0]

      this.tasks.push(task)
      // this.tasksCount.visible++
    })

    if (this.lastOrder >= MAX_LIST_ORDER) await this.reorderTasks()
  },
  async updateTask(options) {
    if (!this.userId) throw new Error('Invalid user data!')

    // const isOptionsValid = check.all(check.map(options, {
    //   name: check.string && check.nonEmptyString,
    //   description: check.string,
    //   priority: check.string,
    //   tags: check.array
    // }))
    //
    // if (!isOptionsValid || !this.userId || !this.listId) throw new Error('Invalid task options!')

    const query = { _id: options.id }
    const modifier = {
      done: options.done
    }

    update(this.tasks, query, modifier)
    await db.tasks.update(query, modifier)
  },
  async removeTask(id) {
    if (!this.userId) throw new Error('Invalid user data!')

    const isOptionsValid = check.string(id)

    if (!isOptionsValid) throw new Error('Invalid task id!')

    const tasksOptions = { _id: id }

    remove(this.tasks, tasksOptions)
    await db.tasks.remove(tasksOptions)
  },
  async removeCompletedTasks() {
    if (!this.userId) throw new Error('Invalid user data!')

    const completedTaskIds = this.tasks.filter(task => task.done).map(item => item._id)

    this.tasks = this.tasks.filter(task => !task.done)
    await db.tasks.remove({ _id: { $in: completedTaskIds } })
  },
  async removeAllTasks(listId) {
    if (!this.userId) throw new Error('Invalid user data!')

    const isListIdValid = check.string(listId)

    if (!isListIdValid) throw new Error('Invalid list id!')

    // update store

    if (this.showHiddenTasks) {
      this.tasks = []
    } else {
      this.tasks = this.tasks.filter(task => task.hidden)
    }

    // this.tasksCount.hidden = 0
    // this.tasksCount.visible = 0

    // update db

    const query = { listId }

    if (!this.showHiddenTasks) {
      query.hidden = true
    }

    await db.tasks.remove(query)
  },
  async toggleTaskVisibility(id) {
    if (!this.userId) throw new Error('Invalid user data!')

    const isOptionsValid = check.string(id)

    if (!isOptionsValid) throw new Error('Invalid task options!')

    const task = this.tasks.find(task => task._id === id)

    const query = { _id: id }
    const modifier = { hidden: !get(task, 'hidden', false) }

    update(this.tasks, query, modifier)
    await db.tasks.update(query, modifier)
  },
  async swapTasks(movedTasks = []) {
    if (movedTasks.length < 2) throw new Error('Error tasks moving!')

    const [taskIdA, taskIdB] = movedTasks
    const taskA = this.tasks.find(task => task._id === taskIdA)
    const taskB = this.tasks.find(task => task._id === taskIdB)

    const prevOrderA = taskA.order
    const prevOrderB = taskB.order

    taskA.order = prevOrderB
    taskB.order = prevOrderA

    await db.tasks.update({ _id: taskIdA }, { order: prevOrderB })
    await db.tasks.update({ _id: taskIdB }, { order: prevOrderA })
  },
  async reorderTasks() {
    let newOrder = 0
    for (const task of this.sortedTasksByOrder) {
      const query = { _id: task._id }
      const modifier = { order: ++newOrder }

      update(this.tasks, query, modifier)

      await db.tasks.update(query, { order: newOrder })
    }
  }
}
