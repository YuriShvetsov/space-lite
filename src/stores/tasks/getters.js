export default {
  lastOrder() {
    if (!this.tasks.length) return 0

    const orders = this.tasks.map(task => task.order).sort()
    return orders[orders.length - 1]
  },
  orders() {
    return this.tasks.map(task => task.order)
  },
  sortedTasksByOrder() {
    return [...this.tasks].sort((taskA, taskB) => {
      return taskA.order - taskB.order
    })
  },
  filteredTasks() {
    if (this.showHiddenTasks) return this.sortedTasksByOrder
    return this.sortedTasksByOrder.filter(item => !item.hidden)
  }
}
