import { remove, get, set, findIndex, keys } from 'lodash'
import check from 'check-types'

import db from '@/database'

import { update, delay } from '@/utils/helpers'

const MAX_ORDER = 100000000
// const MAX_ORDER = 1

export default {

  // Startup actions

  async init() {
    await this.getProjects()
    await this.getTasks()
    this.updateTasksCounters()
  },
  async getProjects() {
    const projects = await db.projects.find({ userId: this.userId }, { $orderBy: 'order' })
    this.projects = [...projects]
  },

  // Projects actions

  async createProject(options) {
    if (!check.all(check.map(options, {
      name: check.string && check.nonEmptyString,
      icon: check.string && check.nonEmptyString
    }))) throw new Error('Invalid projects options!')

    const now = (new Date()).toISOString()
    const projectData = {
      userId: this.userId,
      createdAt: now,
      modifiedAt: now,
      name: options.name,
      icon: options.icon,
      hidden: false,
      opened: false,
      tags: [],
      tasksCounter: {
        hidden: 0,
        visible: 0
      },
      order: this.getNextProjectOrder(),
    }

    await db.projects.insert(projectData, async res => {
      const { inserted = [] } = res

      if (!inserted.length) throw new Error('Project was not saved!')

      const project = inserted[0]

      this.projects.push(project)
      await this.openProject(project._id)
    })

    if (this.lastProjectOrder >= MAX_ORDER) await this.reorderProjects()

    
  },
  async openProject(id) {
    if (!check.string(id)) throw new Error('Invalid project id!')

    const prevOpenedProjectId = get(this.openedProject, '_id', null)
    const prevQuery = { _id: prevOpenedProjectId }
    const prevModifier = { opened: false }

    const nextQuery = { _id: id }
    const nextModifier = { opened: true }

    this.tasks = []

    if (prevOpenedProjectId) update(this.projects, prevQuery, prevModifier)
    update(this.projects, nextQuery, nextModifier)

    await this.getTasks()

    if (prevOpenedProjectId) await db.projects.update(prevQuery, prevModifier)
    await db.projects.update(nextQuery, nextModifier)
  },
  async closeProject(id) {
    if (!check.string(id)) throw new Error('Invalid project id!')

    const query = { _id: id }
    const modifier = { opened: false }

    update(this.projects, query, modifier)
    await db.projects.update(query, modifier)
  },
  async updateProject(options) {
    if (!check.all(check.map(options, {
      id: check.string && check.nonEmptyString,
      name: check.string && check.nonEmptyString,
      icon: check.string && check.nonEmptyString
    }))) throw new Error('Invalid project options!')

    const query = { _id: options.id }
    const modifier = {
      name: options.name,
      icon: options.icon
    }

    update(this.projects, query, modifier)
    await db.projects.update(query, modifier)
  },
  async removeProject(id) {
    if (!check.string(id)) throw new Error('Invalid project id!')

    const closestProjectId = this.findClosestProjectId(id)

    this.projects = this.projects.filter(item => item._id !== id)

    if (closestProjectId) await this.openProject(closestProjectId)

    await db.projects.remove({ _id: id })
  },
  async showProject(id) {
    if (!check.string(id)) throw new Error('Invalid project id!')

    const query = { _id: id }
    const modifier = { hidden: false }

    update(this.projects, query, modifier)

    await db.projects.update(query, modifier)
  },
  async hideProject(id) {
    if (!check.string(id)) throw new Error('Invalid project id!')

    const query = { _id: id }
    const modifier = { hidden: true, opened: this.showHiddenProjects }
    const closestProjectId = this.findClosestProjectId(id)

    update(this.projects, query, modifier)

    if (closestProjectId) update(this.projects, {
      _id: closestProjectId
    }, {
      opened: !this.showHiddenProjects
    })

    // update tasks if the opened project has been changed
    if (this.openedProject && this.openedProject._id !== id) {
      await this.getTasks()
    }

    await db.projects.update(query, modifier)

    if (closestProjectId) {
      await db.projects.update({ _id: closestProjectId }, { opened: !this.showHiddenProjects })
    }
  },
  async moveProjects(pair = []) {
    if (!check.all(check.map(pair, [
      check.string && check.nonEmptyString,
      check.string && check.nonEmptyString
    ]))) throw new Error('Invalid project ids!')

    const [projectIdA, projectIdB] = pair
    const projectA = this.projects.find(project => project._id === projectIdA)
    const projectB = this.projects.find(project => project._id === projectIdB)

    const prevOrderA = projectA.order
    const prevOrderB = projectB.order

    // Algorithm:

    // 1. if orderA < orderB

    // 1) replace orderA to orderB
    // 2) decrease orders for projectB and projects between A and B

    // 2. if orderA > orderB

    // 1) replace orderA to orderB
    // 2) increase orders for projectB and projects between A and B

    const moveDown = async () => {
      const projectsForModify = this.projects.filter(item => {
        return item.order > prevOrderA && item.order <= prevOrderB
      })

      projectA.order = prevOrderB
      projectsForModify.forEach(item => {
        item.order = item.order - 1
      })

      // save to db
      await db.projects.update({ _id: projectIdA }, { order: prevOrderB })
      for (const project of projectsForModify) {
        await db.projects.update({ _id: project._id }, { order: project.order })
      }
    }
    const moveUp = async () => {
      const projectsForModify = this.projects.filter(item => {
        return item.order < prevOrderA && item.order >= prevOrderB
      })

      projectA.order = prevOrderB
      projectsForModify.forEach(item => {
        item.order = item.order + 1
      })

      // save to db
      await db.projects.update({ _id: projectIdA }, { order: prevOrderB })
      for (const project of projectsForModify) {
        await db.projects.update({ _id: project._id }, { order: project.order })
      }
    }

    (prevOrderA < prevOrderB) ? await moveDown() : await moveUp()
  },

  // Tasks actions

  async createTask(options) {
    if (!this.userId) throw new Error('Invalid user data!')

    if (!check.all(check.map(options, {
      projectId: check.string && check.nonEmptyString,
      name: check.string && check.nonEmptyString,
      description: check.string,
      priority: check.string,
      tags: check.array
    }))) throw new Error('Invalid task options!')

    const now = (new Date()).toISOString()
    const taskData = {
      userId: this.userId,
      projectId: options.projectId,
      done: false,
      name: options.name,
      description: options.description,
      notes: [],
      tags: [],
      priority: options.priority,
      hidden: false,
      createdAt: now,
      modifiedAt: now,
      order: this.getNextTaskOrder()
    }

    await db.tasks.insert(taskData, res => {
      const { inserted = [] } = res

      if (!inserted.length) throw new Error('Task was not saved!')

      const task = inserted[0]

      this.tasks.push(task)
      this.updateTasksCounters(options.projectId)
    })

    if (this.lastTaskOrder >= MAX_ORDER) await this.reorderTasks()
  },
  async updateTask() {

  },
  async removeTask() {

  },
  async showTask() {

  },
  async hideTask() {

  },
  async moveTasks(pair = []) {
    if (!check.all(check.map(pair, [
      check.string && check.nonEmptyString,
      check.string && check.nonEmptyString
    ]))) throw new Error('Invalid tasks ids!')

    const [taskIdA, taskIdB] = pair
    const taskA = this.tasks.find(task => task._id === taskIdA)
    const taskB = this.tasks.find(task => task._id === taskIdB)

    const prevOrderA = taskA.order
    const prevOrderB = taskB.order

    // Algorithm is similar in the action moveProjects

    const moveDown = async () => {
      const tasksForModify = this.tasks.filter(item => {
        return item.order > prevOrderA && item.order <= prevOrderB
      })

      taskA.order = prevOrderB
      tasksForModify.forEach(item => {
        item.order = item.order - 1
      })

      // save to db
      await db.tasks.update({ _id: taskIdA }, { order: prevOrderB })
      for (const task of tasksForModify) {
        await db.tasks.update({ _id: task._id }, { order: task.order })
      }
    }
    const moveUp = async () => {
      const tasksForModify = this.tasks.filter(item => {
        return item.order < prevOrderA && item.order >= prevOrderB
      })

      taskA.order = prevOrderB
      tasksForModify.forEach(item => {
        item.order = item.order + 1
      })

      // save to db
      await db.tasks.update({ _id: taskIdA }, { order: prevOrderB })
      for (const task of tasksForModify) {
        await db.tasks.update({ _id: task._id }, { order: task.order })
      }
    }

    (prevOrderA < prevOrderB) ? await moveDown() : await moveUp()
  },

  // Helpers

  async reorderProjects() {
    let newOrder = 0
    for (const project of this.sortedProjectsByOrder) {
      const query = { _id: project._id }
      const modifier = { order: ++newOrder }

      update(this.projects, query, modifier)

      await db.projects.update(query, { order: newOrder })
    }
  },
  getNextProjectOrder() {
    return this.lastProjectOrder + 1
  },
  findClosestProjectId(id) {
    if (!check.string(id)) throw new Error('Invalid project id!')

    const index = findIndex(this.availableProjects, item => item._id === id)
    const prevProject = this.availableProjects[index - 1] || null
    const nextProject = this.availableProjects[index + 1] || null

    return get(nextProject, '_id', null) || get(prevProject, '_id', null)
  },
  updateTasksCounters(projectId = null) {
    const tasksCounter = db.tasksCounter.exec()

    if (!projectId) {
      this.projects = this.projects.map(project => {
        const counters = tasksCounter.find(counter => counter.projectId === project._id)

        return {
          ...project,
          tasksCounter: {
            hidden: counters?.hidden || 0,
            visible: counters?.visible || 0
          }
        }
      })

      return
    }

    const project = this.projects.find(item => item._id === projectId)
    const counter = tasksCounter.find(counter => counter.projectId === projectId)

    project.tasksCounter = {
      hidden: counter?.hidden || 0,
      visible: counter?.visible || 0
    }
  },

  async getTasks() {
    if (!this.openedProject) return

    const tasks = await db.tasks.find({
      userId: this.userId,
      projectId: this.openedProject._id
    }, { $orderBy: 'order' })

    this.tasks = [...tasks]
  },
  async reorderTasks() {
    let newOrder = 0
    for (const task of this.sortedTasksByOrder) {
      const query = { _id: task._id }
      const modifier = { order: ++newOrder }

      update(this.tasks, query, modifier)

      await db.tasks.update(query, { order: newOrder })
    }
  },
  getNextTaskOrder() {
    return this.lastTaskOrder + 1
  },
  startSaving() {
    this.isSaving = true
  },
  finishSaving() {
    this.isSaving = false
  }
}
