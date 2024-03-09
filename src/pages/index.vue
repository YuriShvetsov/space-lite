<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

// import Loader from '../shared/ui/loader'

const router = useRouter()

</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
<!--    <template v-if="isShowLoader">-->
<!--      <Loader />-->
<!--    </template>-->
  </RouterView>
</template>
