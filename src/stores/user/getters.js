export default {
  isDarkTheme() {
    return (
      this.theme === 'dark' ||
      this.theme === 'auto' && this.systemAppearance === 'dark'
    )
  }
}
