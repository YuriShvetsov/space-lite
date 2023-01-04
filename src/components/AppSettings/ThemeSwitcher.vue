<template>
  <radio
    :items="modifiedThemesList"
    :current="curTheme"
    @update="changeCurTheme"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'appearance-switcher',
  computed: {
    ...mapGetters(['curTheme', 'themes']),
    modifiedThemesList() {
      return this.themes.map(theme => {
        return {
          name: `${ theme[0].toUpperCase() }${ theme.slice(1) }`,
          value: theme
        }
      })
    }
  },
  methods: {
    ...mapActions(['changeCurTheme'])
  }
}
</script>
