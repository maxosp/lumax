<template>
  <div v-show="isVisible" class="full-size-slider">
    <div class="close-button-wrapper">
      <Icon
        type="close"
        size="20"
        @click="$emit('onCloseFullSizeSlider', swiper.activeIndex)"
      />
    </div>
    <Swiper
      ref="fullSizeSlider"
      :options="swiperOptions"
    >
      <SwiperSlide
        v-for="(img, i) in $images"
        :key="img.id"
        class="slide"
      >
        <div
          :data-index="i"
          :style="{backgroundImage: `url('${img.file}')`}"
          class="slide image"
        />
      </SwiperSlide>
    </Swiper>
    <div>
      <div
        class="FSS-button-prev"
      >
        <Icon
          type="button-prev"
          size="13"
          class="icon"
        />
      </div>
      <div
        class="FSS-button-next"
      >
        <Icon
          type="button-next"
          size="13"
          class="icon"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SwiperCore, { Controller, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { $images } from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import Icon from '@/ui/icon/Icon.vue'

SwiperCore.use([Navigation, Controller])

export default Vue.extend({
  components: {
    Icon,
    Swiper,
    SwiperSlide,
  },
  effector: {
    $images,
  },
  props: {
    currentSlide: {
      type: Number as PropType<number>,
      default: 0,
    },
    isVisible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  data() {
    return {
      swiper: {} as SwiperCore,
    }
  },
  computed: {
    swiperOptions() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const instance = this

      return {
        slidesPerView: 1,
        loop: true,
        isNavigation: true,
        scrollbar: false,
        height: 500,
        navigation: {
          nextEl: '.FSS-button-next',
          prevEl: '.FSS-button-prev',
        },

        on: {
          init(swiper: SwiperCore) {
            instance.swiper = swiper
          },
        },
      }
    },
    isNavigationVisible(): boolean {
      return !!this.$images && this.$images.length > this.swiperOptions.slidesPerView
    },
  },
  watch: {
    currentSlide(value) {
      if (value) {
        this.$nextTick(() => {
          if (this.swiper.activeIndex !== this.currentSlide) {
            this.swiper.slideTo(value, 0)
          }
        })
      }
    },
  },
})
</script>

<style scoped>
.full-size-slider {
  position: fixed;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  z-index: 10;
  /* background-color: rgba(18,28,48,.9); */
  background-color: var(--modal-overlay-color);
  @mixin flex-center;
}
.swiper-slide {
  height: 80vh;
  width: 80vw;
}
.slide.image {
  height: 100%;
  width: 100%;
  max-height: 80vh;
  max-width: 80vw;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
}
.FSS-button-prev,
.FSS-button-next {
  position: absolute;
  top: calc(50% - 20px);
  width: 40px;
  height: 40px;
  margin: 0;
  border: 2px solid #fff;
  border-radius: 50%;
  @mixin flex-center;
  z-index: 11;
}
.FSS-button-prev {
  left: 30px;
}
.FSS-button-next {
  right: 30px;
}
.FSS-button-prev,
.FSS-button-next {
  border-color: #fff;
}
.FSS-button-prev:hover,
.FSS-button-next:hover {
  background-color: #fff;
}
.FSS-button-prev svg,
.FSS-button-next svg {
  fill: #fff;
}
.FSS-button-prev:hover svg,
.FSS-button-next:hover svg {
  fill: #0f2345;
}
.close-button-wrapper {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  fill: #fff;
  z-index: 11;
  @mixin flex-center;
}
</style>
