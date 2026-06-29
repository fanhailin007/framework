<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg" :icon="icon" is-custom-svg />
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">{{ oops }}</div>
        <div class="bullshit-headline">{{ headline }}</div>
        <div class="bullshit-info">{{ info }}</div>
        <router-link v-slot="{ navigate }" custom to="/">
          <el-button type="primary" @click="navigate">{{ btn }}</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ErrorContainer',
})

defineProps({
  oops: {
    type: String,
    default: '',
  },
  headline: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '',
  },
  btn: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss">
.error-container {
  @media (max-width: 768px) {
    .error-content {
      flex-direction: column !important;
      padding-top: 6.5vh;

      .pic-error {
        height: 200px !important;
      }
    }
  }

  .error-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: 1000px;
    height: calc(var(--el-container-height) - 40px);
    margin: auto;

    .pic-error {
      flex-basis: 65%;
      height: 300px;
      opacity: 0;
      transform: translateX(-60px) scale(0.8) rotate(-8deg);
      animation: error-bounce-in 0.8s cubic-bezier(0.23, 1.5, 0.32, 1) 0.15s forwards;
      will-change: transform, opacity;

      .error-svg {
        width: 100%;
        height: 100%;
        transition:
          transform 0.3s cubic-bezier(0.23, 1.5, 0.32, 1),
          filter 0.3s;
      }

      &:hover .error-svg {
        filter: drop-shadow(0 0 16px var(--el-color-primary));
        transform: scale(1.08) rotate(4deg);
      }
    }

    .bullshit {
      flex-basis: 35%;
      padding: 32px 24px 24px 24px;
      border-radius: 12px;
      opacity: 0;
      transform: translateY(24px);
      animation: headline-fade-up 0.6s cubic-bezier(0.23, 1.5, 0.32, 1) 0.7s forwards;
      will-change: transform, opacity;

      &-oops {
        margin-bottom: var(--el-margin);
        font-size: calc(var(--el-font-size-extra-large) + 8px);
        font-weight: bold;
        color: var(--el-color-primary);
        letter-spacing: 2px;
        opacity: 1;
        transform: none;
        animation: none;
      }

      &-headline {
        margin-bottom: 10px;
        font-size: var(--el-font-size-large);
        font-weight: bold;
        color: var(--el-color-grey);
        opacity: 1;
        transform: none;
        animation: none;
      }

      &-info {
        margin-bottom: 30px;
        font-size: var(--el-font-size-extra-small);
        color: var(--el-color-grey);
        opacity: 1;
        transform: none;
        animation: none;
      }
    }
  }
}

@keyframes error-bounce-in {
  0% {
    opacity: 0;
    transform: translateX(-60px) scale(0.8) rotate(-8deg);
  }
  60% {
    opacity: 1;
    transform: translateX(10px) scale(1.05) rotate(6deg);
  }
  80% {
    transform: translateX(-4px) scale(0.98) rotate(-2deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotate(0);
  }
}

@keyframes error-slide-up {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-8px) scale(1.03);
  }
  80% {
    transform: translateY(4px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes oops-bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    opacity: 1;
    transform: scale(1.08);
  }
  80% {
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes headline-fade-up {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

#app {
  > .error-container {
    > .error-content {
      height: calc(var(--vh, 1vh) * 100);
    }
  }
}
</style>
