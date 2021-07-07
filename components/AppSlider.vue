<template>
  <div class="container">
    <Hooper ref="hooper" :settings="hooperSettings">
      <Slide v-for="(slide, id) in slides" :key="id">
        <img :src="`images/${slide}.png`" :alt="slide">
      </Slide>
    </Hooper>
    <div class="slider-nav">
      <span @click="sliderPrev" class="icon-arrow left">&#xe902;</span>
      <span @click="sliderNext" class="icon-arrow right">&#xe902;</span>
    </div>
    <div class="slider-title">
      {{ currentTitle }}
    </div>
  </div>
</template>

<script lang="ts">
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'

export default {
  name: 'AppSlider',
  components: {
    Hooper,
    Slide
  },
  props: {
    slides: { type: Array, default: () => [] }
  },
  data () {
    return {
      hooper: null,
      hooperSettings: {
        centerMode: true
      }
    }
  },
  computed: {
    currentTitle () {
      return this.hooper && this.slides[this.hooper.currentSlide]
    }
  },
  methods: {
    sliderPrev () {
      this.$refs.hooper.slidePrev()
    },
    sliderNext () {
      this.$refs.hooper.slideNext()
    }
  },
  mounted () {
    this.hooper = this.$refs.hooper
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 50px;
  position: relative;
}

.slider-nav {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
}

.icon-arrow {
  @include flex-row;
  font-size: 55px;
  font-family: 'icomoon';
  color: $primary-color;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    filter: drop-shadow($box-shadow);
  }
}

.left {
  margin-left: 5%;
  transform: rotate(90deg) translateX(-50%);
}

.right {
  margin-right: 5%;
  transform: rotate(-90deg) translateX(50%);
}

.slider-title {
  margin-top: 20px;
  margin-right: auto;
}
</style>

<style>
/* Slider main styles */
.hooper {
  margin: 0 auto;
  height: 400px;
  text-align: center;
}

.hooper-list {
  border-radius: 15px;
}

.hooper img {
  border-radius: 15px;
  height: 100%;
}
</style>
