<template>
  <div class="auth-layout">
    <img
      ref="chart"
      src="~assets/img/bg-chart.svg"
      class="chart"
      :style="{ transform: `translate(${translateX}px, ${translateY}px)` }"
    >

    <div class="content">
      <div class="content-wrap">
        <img
          src="~assets/img/logo.png"
          srcset="~assets/img/logo@2x.png 2x, ~assets/img/logo@3x.png 3x"
          alt="logo"
          class="logo"
        >
        <router-view />
      </div>
    </div>

    <AuthFooter class="footer" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AuthFooter from '@/features/common/footer/AuthFooter.vue'

const INIT_X = 267

export default Vue.extend({
  name: 'AuthLayout',
  components: {
    AuthFooter,
  },

  data: () => ({
    translateX: -INIT_X,
    translateY: 0,
  }),
  methods: {
    moveParallax(e: MouseEvent) {
      const w = window.innerWidth / 2
      const h = window.innerHeight / 2
      const mouseX = e.clientX
      const mouseY = e.clientY
      this.translateX = (mouseX - w) * 0.01 - INIT_X
      this.translateY = (mouseY - h) * 0.01
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.moveParallax)
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.moveParallax)
  },
})
</script>

<style scoped>
* {
  --auth-footer-height: 72px;
}

.auth-layout {
  position: relative;
  display: grid;
  grid-template-rows: 1fr var(--auth-footer-height);
  grid-template-areas: 'content' 'footer';
  flex-direction: column;
  min-height: 100%;
  background: url('~assets/img/bg-dot.svg'),
    radial-gradient(circle at 53% 53%, #4f5dca, #7481eb 60%);
  overflow: hidden;
}
.content {
  grid-area: content;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.content-wrap {
  width: 400px;
}
.logo {
  display: block;
  margin: 0 auto 39px;
}
.footer {
  grid-area: footer;
  width: 100%;
}
.chart {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-267px);
  z-index: 1;
}
</style>


