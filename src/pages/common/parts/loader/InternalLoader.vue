<template>
  <div class="container">
    <div class="spinner-block">
      <div class="spinner" />
    </div>
  </div>
</template>

<style scoped>
.spinner {
  position: relative;
  width: 36px;
  height: 36px;
  @keyframes rotate-animation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes anti-rotate-animation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-360deg);
    }
  }
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    border-width: 4px;
    border-style: solid;
    border-radius: 50%;
  }
  &:before {
    width: 100%;
    height: 100%;
    border-bottom-color: var(--c-yellow-1);
    border-right-color: var(--c-yellow-1);
    border-top-color: transparent;
    border-left-color: transparent;
    top: 0px;
    left: 0px;
    animation: rotate-animation 1s linear 0s infinite;
  }
  &:after {
    width: 56%;
    height: 56%;
    border-bottom-color: var(--c-yellow-1);
    border-right-color: var(--c-yellow-1);
    border-top-color: transparent;
    border-left-color: transparent;
    left: calc((100% - 56%) / 2);
    top: calc((100% - 56%) / 2);
    animation: anti-rotate-animation 0.85s linear 0s infinite;
  }
}
</style>
