<template>
  <div class="loader">
    <div class="content">
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
      <div class="bubble-container">
        <div class="bubble" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  position: relative;
  width: 26px;
  height: 26px;
}
.bubble-container {
  transform-origin: -150% 50%;
  position: absolute;
  top: calc(50% - 4px / 2);
  left: calc(50% - 4px / 2);
  transform: translate(-50%, -50%);
  &:nth-child(1) {
    transform: translateX(200%) rotate(-90deg);
    .bubble {
      animation-delay: -1.5s;
    }
  }
  &:nth-child(2) {
    transform: translateX(200%) rotate(-45deg);
    .bubble {
      animation-delay: -1.375s;
    }
  }
  &:nth-child(3) {
    transform: translateX(200%);
    .bubble {
      animation-delay: -1.25s;
    }
  }
  &:nth-child(4) {
    transform: translateX(200%) rotate(45deg);
    .bubble {
      animation-delay: -1.125s;
    }
  }
  &:nth-child(5) {
    transform: translateX(200%) rotate(90deg);
    .bubble {
      animation-delay: -1s;
    }
  }
  &:nth-child(6) {
    transform: translateX(200%) rotate(135deg);
    .bubble {
      animation-delay: -0.875s;
    }
  }
  &:nth-child(7) {
    transform: translateX(200%) rotate(180deg);
    .bubble {
      animation-delay: -0.75s;
    }
  }
  &:nth-child(8) {
    transform: translateX(200%) rotate(225deg);
    .bubble {
      animation-delay: -0.625s;
    }
  }
}
.bubble {
  background-color: #fff;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: bubble 1s infinite;
}

@keyframes bubble {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
    transform: scale(0.4);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
