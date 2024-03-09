<template>
  <div class="ui page">
    <header class="ui__header">
      <div class="ui__header-wrapper container">
        <h1 class="ui__header-title">UI</h1>
        <a class="ui__header-link" href="/dev">
          <span>Go back</span>
        </a>
      </div>
    </header>
    <main class="main ui__main">
      <section class="ui__section">
        <div class="container">
          <h2 class="ui__section-title">Heading</h2>
          <p class="ui__section-description">/shared/ui/heading</p>
          <table class="table">
            <tbody class="table__body">
              <tr class="table__row table__row_head">
                <th class="table__cell table__cell_head">Props</th>
                <th class="table__cell table__cell_head table__cell_max-content">Display</th>
              </tr>
              <tr
                v-for="(variant, index) of headingVariants"
                :key="index"
                class="table__row"
              >
                <td class="table__cell">
                  <Code :code="variant" />
                </td>
                <td class="table__cell">
                  <Heading v-bind="variant">{{ headingContent }}</Heading>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="ui__section">
        <div class="container">
          <h2 class="ui__section-title">Paragraph</h2>
          <p class="ui__section-description">/shared/ui/paragraph</p>
          <table class="table">
            <tbody class="table__body">
              <tr class="table__row table__row_head">
                <th class="table__cell table__cell_head">Props</th>
                <th class="table__cell table__cell_head table__cell_max-content">Display</th>
              </tr>
              <tr
                v-for="(variant, index) of paragraphVariants"
                :key="index"
                class="table__row"
              >
                <td class="table__cell">
                  <Code :code="variant" />
                </td>
                <td class="table__cell">
                  <Paragraph v-bind="variant">{{ paragraphContent }}</Paragraph>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="ui__section">
        <div class="container">
          <h2 class="ui__section-title">Icon</h2>
          <p class="ui__section-description">/shared/ui/icon</p>
          <table class="table">
            <tbody class="table__body">
              <tr class="table__row table__row_head">
                <th class="table__cell table__cell_head">Props</th>
                <th class="table__cell table__cell_head table__cell_max-content">Display</th>
              </tr>
              <tr
                v-for="(variant, index) of iconVariants"
                :key="index"
                class="table__row"
              >
                <td class="table__cell">
                  <Code :code="variant" />
                </td>
                <td class="table__cell">
                  <Icon v-bind="variant" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="ui__section">
        <div class="container">
          <h2 class="ui__section-title">Button</h2>
          <p class="ui__section-description">/shared/ui/button</p>
          <table class="table">
            <tbody class="table__body">
              <tr class="table__row table__row_head">
                <th class="table__cell table__cell_head">Props</th>
                <th class="table__cell table__cell_head table__cell_max-content">Display</th>
              </tr>
              <tr
                v-for="(variant, index) of buttonVariants"
                :key="index"
                class="table__row"
              >
                <td class="table__cell">
                  <Code :code="variant" />
                </td>
                <td class="table__cell">
                  <Button v-bind="variant" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import Heading from '@/shared/ui/heading'
import Paragraph from '@/shared/ui/paragraph'
import Icon from '@/shared/ui/icon'
import Button from '@/shared/ui/button'

import Code from './Code.vue'

import {
  headingVariants,
  headingContent,
  paragraphVariants,
  paragraphContent,
  iconVariants,
  buttonVariants
} from './config'
</script>

<style lang="scss">
.ui__header {
  width: 100%;
  height: 65px;
  position: fixed;
  top: 0;
  z-index: 10;

  background-color: #fff;
  border-bottom: 1px solid #dcdcdc;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
}

.ui__header-title {
  font-size: 24px;
  font-weight: bold;
}

.ui__header-wrapper {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
}

.ui__header-link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 16px;

  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: #456eea;

  background-color: transparent;
  border-radius: 6px;
  transition: background-color $base-transition;

  &:hover {
    text-decoration: none;
    background-color: #f3f6ff;
  }
}

.ui__main {
  padding: 73px 0 8px;
}

.ui__section {
  margin: 36px 0;
}

.ui__section-title {
  margin-bottom: 4px;
  font-size: 20px;
  font-weight: 800;
}

.ui__section-description {
  font-size: 16px;
  color: #535353;
}

.table {
  display: block;
  width: 100%;
  max-height: calc(100vh - 200px);
  margin-top: 18px;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;

  font-size: 14px;

  border: 1px solid #dcdcdc;
  border-collapse: collapse;
  border-radius: 8px;
}

.table__body {
  display: table;
  width: 100%;
}

.table__row_head {
  position: sticky;
  top: 0;
  z-index: 1;
}

.table__cell,
.table__cell_head {
  padding: 12px;
  border: 1px solid #dcdcdc;
}

.table__cell_head,
.table__cell_bold {
  font-weight: bold;
}

.table__cell_head {
  background-color: #ecf0ff;
}

.table__cell_top {
  vertical-align: top;
}

.table__cell_max-content {
  width: 100%;
}

.table__cell_nowrap {
  white-space: nowrap;
}

.table__row:first-child .table__cell_head {
  border-top: 0;
}

.table__row:last-child .table__cell {
  border-bottom: 0;
}

.table__row .table__cell:first-child {
  border-left: 0;
}

.table__row .table__cell:last-child {
  border-right: 0;
}

.table__text {
  margin: 2px 0;
  font-weight: normal;
}

.table__text_nowrap {
  white-space: nowrap;
}

</style>
