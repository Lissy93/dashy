<template>
 <transition name="slide-fade">
  <div id="loading" v-if="isLoading" :class="c" @click="c = 'hide'">
    <h2>Dashy</h2>
    <div class="inner-container">
      <p>Loading</p>
      <span class="dots-cont">
        <span class="dot dot-1"></span>
        <span class="dot dot-2"></span>
        <span class="dot dot-3"></span>
        <span class="dot dot-4"></span>
      </span>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingScreen',
  props: {
    isLoading: { type: Boolean, default: false },
  },
  data: () => ({
    c: '',
  }),
};
</script>

<style scoped lang="scss">
div#loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 7;
  background: var(--loading-screen-background);
  color: var(--loading-screen-color);

  &.hide { display: none; }

  .inner-container {
    text-align: center;
  }

  p {
    font-size: 6vw;
    display: inline;
    margin: 0 auto;
  }
  h2 {
    opacity: 0.35;
    font-size: 16vw;
    margin: 0;
  }

  .dots-cont {
    display: inline;
    .dot {
      width: 4px;
      height: 4px;
      background: var(--loading-screen-color);
      display: inline-block;
      border-radius: 35%;
      right: 0px;
      bottom: 0px;
      margin: 0px 2.5px;
      position: relative;
      animation: jump 1s infinite;
      &.dot-1 {
        -webkit-animation-delay: 100ms;
        animation-delay: 100ms;
      }
      &.dot-2 {
        -webkit-animation-delay: 200ms;
        animation-delay: 200ms;
      }
      &.dot-3 {
        -webkit-animation-delay: 300ms;
        animation-delay: 300ms;
      }
      &.dot-4 {
        -webkit-animation-delay: 400ms;
        animation-delay: 400ms;
      }
    }
  }

  @keyframes jump {
    0% {
      bottom: 0px;
    }

    20% {
      bottom: 5px;
    }

    40% {
      bottom: 0px;
    }
  }
}

.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1, 0.9, 0.7, 0.4);
}
.slide-fade-enter, .slide-fade-leave-to  {
  transform: translateY(-200px);
  opacity: 0;
}
</style>
