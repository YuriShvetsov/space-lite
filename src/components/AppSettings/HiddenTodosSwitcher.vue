<template>
  <checkbox
    :checked="hiddenTodosVisible"
    @change="toggleHiddenTodosVisible"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'hidden-todos-switcher',
  computed: {
    ...mapGetters([
      'hiddenTodosVisible'
    ])
  },
  methods: {
    ...mapActions([
      'toggleHiddenTodosVisible'
    ])
  }
}
</script>
