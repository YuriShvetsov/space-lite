export default {
  openedList() {
    return this.lists.find(item => item._id === this.openedListId)
  }
}
