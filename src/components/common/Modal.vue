<template>
  <div class="modal">
    <Transition name="fade">
      <div v-if="isVisible" class="modal__overlay" @click="close"></div>
    </Transition>

    <Transition name="fade-scale" @after-leave="onAfterLeave">
      <div v-if="isVisible" class="modal__container">
        <div class="modal__header">
          <slot name="header"></slot>
        </div>
        <div class="modal__body">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'modal',
  emits: ['closed'],
  props: {
    isAutoOpen: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isVisible: false,
      resolveClosePromise: null
    }
  },
  methods: {
    open() {
      this.isVisible = true
      document.body.style.overflow = 'hidden'
    },
    close() {
      return new Promise((resolve) => {
        this.isVisible = false
        document.body.style.overflow = 'hidden'
        this.resolveClosePromise = resolve
      })
    },

    onKeydownDocument() {
      document.addEventListener('keydown', (e) => {
        if (!this.isVisible) return

        switch (e.code) {
          case 'Escape':
            this.close()
            break
        }
      })
    },
    onAfterLeave() {
      this.$emit('closed')
      this.resolveClosePromise()
    }
  },
  mounted() {
    if (this.isAutoOpen) this.open()
    this.onKeydownDocument()
  }
}
</script>

<style lang="scss">
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

.modal__header {
  width: 100%;
  padding: 16px 20px;
  position: relative;

  background-color: get-light($bgColor, 'main');
  border-top: 1px solid get-light($sectionBorderColor);
  border-right: 1px solid get-light($sectionBorderColor);
  border-bottom: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
  border-radius: 8px 8px 0 0;
}

.modal__close-button {
  position: absolute;
  right: 0;
  top: 14px;
  transform: translate(-50%, 0);
}

.modal__body {
  width: 100%;
  padding: 16px 20px 20px;

  background-color: get-light($bgColor, 'main');
  border-right: 1px solid get-light($sectionBorderColor);
  border-bottom: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
  border-radius: 0 0 8px 8px;
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

  background-color: rgba(31, 31, 31, 0.22);
  cursor: pointer;
  pointer-events: all;
  transition: background-color 300ms ease-out;
}

.modal__overlay:hover {
  background-color: rgba(31, 31, 31, 0.32);
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

@include dark-theme {
  .modal__overlay {
    background-color: rgba(31, 31, 31, 0.3);
  }

  .modal__overlay:hover {
    background-color: rgba(31, 31, 31, 0.45);
  }

  .modal__container {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  }

  .modal__header {
    background-color: get-dark($bgColor, 'main');
    border-top: 1px solid get-dark($formBorderColor);
    border-right: 1px solid get-dark($formBorderColor);
    border-bottom: 1px solid get-dark($sectionBorderColor);
    border-left: 1px solid get-dark($formBorderColor);
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
