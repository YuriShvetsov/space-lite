export default {
  openedList() {
    if (!this.lists.length) return null
    return this.lists.find(item => item.opened) || null
  },
  sortedListsByOrder() {
    return [...this.lists].sort((listA, listB) => {
      return listA.order - listB.order
    })
  },
  filteredLists() {
    if (this.showHiddenLists) return this.sortedListsByOrder
    return this.sortedListsByOrder.filter(item => !item.hidden)
  },
  lastOrder() {
    if (!this.lists.length) return 0
    return this.sortedListsByOrder[this.lists.length - 1].order
  },
  orders() {
    return this.lists.map(list => list.order)
  },
}
