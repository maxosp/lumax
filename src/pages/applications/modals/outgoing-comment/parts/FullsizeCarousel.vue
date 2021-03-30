<template>
  <div class="full-size-carousel">
    <Swiper :options="swiperOptions" :active-index="currentSlide">
      <SwiperSlide
        v-for="(img, i) in slides"
        :key="img.id"
        class="slide"
      >
        <div
          :data-index="i"
          :style="{backgroundImage: `url('${img.file}')`}"
          class="slide image"
        />
      </SwiperSlide>
      <div class="swiper-button-prev" />
      <div class="swiper-button-next" />
    </Swiper>
  </div>
</template>

<script lang="ts">
import { UploadMediaResponse } from '@/features/api/media/types'
import Vue, { PropType } from 'vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default Vue.extend({
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    slides: { type: Array as PropType<UploadMediaResponse[]> },
    currentSlide: { type: Number as PropType<number> },
  },
  computed: {
    swiperOptions() {
      return {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }
    },
  },
})
</script>

<style scoped>
.carousel {
  outline: 1px solid plum;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* background-color: rgba(18,28,48,.9); */
  background-color: var(--modal-overlay-color);
  @mixin flex-center;
  & ::v-deep .VueCarousel-wrapper {
    height: 100%;
    .VueCarousel-inner {
      height: 100%;
      @mixin flex-center;
      .slide img {
        height: auto;
        width: auto;
        max-width: 1200px;
        max-height: 1000px;
      }
    }
  }
}
</style>
