<template>
  <div class="task-board page">
    <main class="main">
      <Navigation />
      <div class="page__container">
        <Heading level="h4">Task board</Heading>
        <div style="display: flex; gap: 12px; padding: 8px 0;">
          <Button>Open settings</Button>
          <Button type="primary">Open task</Button>
          <Button type="danger" :icon="deleteIcon">Delete task</Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Button } from '@yurishvetsov/space-ui'

import Navigation from '@/widgets/navigation/ui'
import Heading from '@/shared/ui/heading'

import deleteIcon from '@/assets/icons/hero/24/outline/trash.svg'

</script>

<style lang="scss">

</style>
