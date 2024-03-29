<template>
  <div class="modal" :class="classNames">

    <Transition name="fade">
      <div
        v-if="isVisible"
        class="modal__overlay"
        @click="close"
      ></div>
    </Transition>

    <Transition name="fade-scale">
      <div
        v-if="isVisible"
        class="modal__container"
      >
        <slot></slot>
      </div>
    </Transition>
    
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: {
    classNames: {
      type: Array,
      default: ['modal_size_default']
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    open() {
      this.isVisible = true
      document.body.style.overflow = 'hidden'
    },
    close() {
      this.isVisible = false
      document.body.style.overflow = 'auto'
    },

    onKeydownDocument() {
      document.addEventListener('keydown', e => {

        if (!this.isVisible) return

        switch (e.code) {
          case 'Escape':
            this.close()
            break
        }
      })
    }
  },
  mounted() {
    this.onKeydownDocument()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env/index';

.modal {
  width: 100vw;
  height: 100vh;
  padding: 0 32px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: get-layer('modal');
  pointer-events: none;
}

.modal__container {
  width: calc(100% - 64px);
  position: absolute;
  left: 50%;
  top: 100px;
  transform: translate(-50%, 0);

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  pointer-events: all;
}

.modal_size_default .modal__container {
  width: unset;
}

.modal_size_xsm .modal__container {
  max-width: 320px;
}

.modal_size_sm .modal__container {
  max-width: 420px;
}

.modal_size_md .modal__container {
  max-width: 640px;
}

.modal_size_lg .modal__container {
  max-width: 720px;
}

.modal_size_xlg .modal__container {
  max-width: 992px;
}

.modal_size_full .modal__container {  
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.modal__overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;

  background-color: rgba(31, 31, 31, .22);
  cursor: pointer;
  pointer-events: all;
  transition: background-color 300ms ease-out;
}

.modal__overlay:hover {
  background-color: rgba(31,31,31,0.32);
}

.fade-enter-active {
  animation: fade-in 150ms ease-in-out;
  animation-fill-mode: both;
}

.fade-leave-active {
  animation: fade-out 150ms ease-in-out;
  animation-fill-mode: both;
}

.fade-scale-enter-active {
  animation: fade-scale-in 150ms ease-in-out;
  animation-fill-mode: both;
}

.fade-scale-leave-active {
  animation: fade-scale-out 150ms ease-in-out;
  animation-fill-mode: both;
}

// Dark theme

.app_theme_dark {

  .modal__overlay {
    background-color: rgba(31, 31, 31, .30);
  }

  .modal__overlay:hover {
    background-color: rgba(31, 31, 31, .45);
  }

  .modal__container {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  }

}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fade-scale-in {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

@keyframes fade-scale-out {
  0% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.9);
  }
}

</style>
