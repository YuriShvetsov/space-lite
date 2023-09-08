<template>
  <div class="design-system">
    <Sprite />

    <div class="design-system__container">
      <h1 class="design-system__title">Design System</h1>

      <div class="design-system__groups">
        <div class="design-system__group">
          <div class="design-system__group-name">SpaceButton</div>
          <div class="design-system__group-content">
            <div class="design-system__row">
              <div class="design-system__col">
                <div class="design-system__row-name">Default</div>
              </div>
              <div class="design-system__col">
                <SpaceButton name="Space Button" />
              </div>
            </div>

            <div class="design-system__row">
              <div class="design-system__col">
                <div class="design-system__row-name">Size</div>
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">sm</div>
                <SpaceButton name="Space Button" size="sm" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">md</div>
                <SpaceButton name="Space Button" size="md" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">lg</div>
                <SpaceButton name="Space Button" size="lg" />
              </div>
            </div>

            <div class="design-system__row">
              <div class="design-system__col">
                <div class="design-system__row-name">Type</div>
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">left-icon</div>
                <SpaceButton name="New" type="left-icon" icon="plus" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">right-icon</div>
                <SpaceButton
                  name="Space Button"
                  type="right-icon"
                  icon="plus"
                />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">icon</div>
                <SpaceButton name="Space Button" type="icon" icon="menu" />
              </div>
            </div>

            <div class="design-system__row">
              <div class="design-system__col">
                <div class="design-system__row-name">Category</div>
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">primary</div>
                <SpaceButton name="Space Button" category="primary" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">accept</div>
                <SpaceButton name="Space Button" category="accept" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">danger</div>
                <SpaceButton name="Space Button" size="danger" />
              </div>
            </div>

            <div class="design-system__row">
              <div class="design-system__col">
                <div class="design-system__row-name">Color</div>
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">black</div>
                <SpaceButton name="Space Button" color="black" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">green</div>
                <SpaceButton name="Space Button" color="green" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">red</div>
                <SpaceButton name="Space Button" color="red" />
              </div>
            </div>

            <div class="design-system__row">
              <div class="design-system__col">
                <div class="design-system__row-name">Combined</div>
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">primary, left-icon</div>
                <SpaceButton
                  name="Space Button"
                  type="left-icon"
                  category="primary"
                  icon="plus"
                />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">primary, right-icon</div>
                <SpaceButton
                  name="Space Button"
                  type="right-icon"
                  category="primary"
                  icon="plus"
                />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">primary, icon</div>
                <SpaceButton type="icon" category="primary" icon="search" />
              </div>
              <div class="design-system__col">
                <div class="design-system__item-label">danger, icon</div>
                <SpaceButton type="icon" category="danger" icon="hero-close" />
                <svg aria-hidden="true">
                  <use href="#hero-outline-close"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sprite from '@/components/Sprite.vue'
import SpaceButton from '@/components/common/SpaceButton.vue'
</script>

<style lang="scss" scoped>
.design-system {
  min-height: 100vh;
  font-family: 'Open Sans', sans-serif;
}

.design-system__title {
  font-family: 'Leckerli One', sans-serif;
}

.design-system__container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.design-system__row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.design-system__row-name {
  min-width: 60px;
  font-size: 13px;
  font-weight: bold;
}

.design-system__col {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;

  &:first-of-type {
    margin-right: 20px;
  }
}

.design-system__group {
  padding: 20px;
  border: 1px solid #dedede;
  border-radius: 8px;
}

.design-system__group-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.design-system__group-name {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 800;
  text-decoration: underline;
}

.design-system__item-label {
  font-size: 13px;
  color: #444;
}
</style>
