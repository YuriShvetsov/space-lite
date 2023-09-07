export default {
  openedList() {
    return this.lists.find(item => item._id === this.openedListId)
  },
  lastOrder() {
    if (!this.lists.length) return 0

    const orders = this.lists.map(list => list.order).sort()
    return orders[orders.length - 1]
  },
  orders() {
    return this.lists.map(list => list.order)
  }
}
