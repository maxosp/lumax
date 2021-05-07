<template>
  <div
    class="swiper-container-wrapper"
    :class="{'swiper-container-wrapper_padded': isNavigationVisible}"
  >
    <Swiper
      ref="mainSlider"
      :options="swiperOptions"
      class="main-comment-slider"
    >
      <SwiperSlide
        v-for="(img, i) in $images"
        :key="img.id"
      >
        <div
          :data-index="i"
          :style="{backgroundImage: `url('${img.file}')`}"
          class="slide image"
        />
      </SwiperSlide>
    </Swiper>

    <div
      v-show="isNavigationVisible"
      class="main-slider-button-prev"
    >
      <Icon
        type="button-prev"
        size="13"
        class="icon"
      />
    </div>
    <div
      v-show="isNavigationVisible"
      class="main-slider-button-next"
    >
      <Icon
        type="button-next"
        size="13"
        class="icon"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import { $images } from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import SwiperCore, { Navigation, Controller } from 'swiper'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

SwiperCore.use([Navigation, Controller])

export default Vue.extend({
  name: 'CommentModal',
  components: {
    Icon,
    Swiper,
    SwiperSlide,
  },
  effector: {
    $images,
  },
  props: {
    currentSlide: { type: Number as PropType<number>, default: 0 },
  },
  data: () => ({
    swiper: {} as SwiperCore,
    clickedSlideIndex: 0,
  }),
  computed: {
    isNavigationVisible(): boolean {
      return !!this.$images && this.$images.length > this.swiperOptions.slidesPerView
    },
    swiperOptions() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const instance = this

      return {
        loop: true,
        isNavigation: true,
        scrollbar: false,
        slidesPerView: 4,
        spaceBetween: 20,
        navigation: {
          nextEl: '.main-slider-button-next',
          prevEl: '.main-slider-button-prev',
        },

        on: {
          init(swiper: SwiperCore) {
            instance.swiper = swiper
          },
          beforeInit(swiper: SwiperCore) {
            /* брутфорс, нужно перед каждым переоткрытием, не срабатывает на первый инит,
                потому что на данный момент изображения еще не загрузились */
            if (
              !!instance.$images &&
              instance.$images.length < instance.swiperOptions.slidesPerView
            ) {
              /* @ts-ignore */
              swiper.params.loop = false
            }
          },
          progress() {
            // не работает эвент клика в бесконечном списке
            // из за дублей слайдера
            document.querySelectorAll('.main-comment-slider .image').forEach((el) => {
              el.removeEventListener('click', instance.openFullSizeHack)
              el.addEventListener('click', instance.openFullSizeHack)
            })
          },
        },
      }
    },
  },
  watch: {
    currentSlide(value) {
      if (value !== this.swiper.activeIndex) {
        this.swiper.slideTo(value, 0)
      }
    },
    $images() {
      /* брутфорс, нужно перед загрузкой слайдера, срабатывает только один раз
        и при переоктрытии опция не работает */
      if (!!this.$images && this.$images.length < this.swiperOptions.slidesPerView) {
        /* @ts-ignore */
        this.$refs.mainSlider.options.loop = false
      }
    },
  },
  methods: {
    openFullSizeHack(e: Event) {
      const target = e.target as HTMLDivElement
      this.clickedSlideIndex = +target.getAttribute('data-index')! + 1
      this.$emit('onSlideClick', this.clickedSlideIndex)
    },
  },
})
</script>

<style scoped>
.swiper-container-wrapper.swiper-container-wrapper_padded {
  padding: 0 60px;
  position: relative;
}
.slide.image {
  height: 80px;
  background-size: cover;
  background-position: center;
}
.btn {
  margin: 30px auto 0;
}
.main-slider-button-prev {
  left: 0;
}
.main-slider-button-next {
  right: 0;
}
.main-slider-button-prev,
.main-slider-button-next {
  position: absolute;
  top: calc(50% - 20px);
  width: 40px;
  height: 40px;
  margin: 0;
  border: 2px solid #0f2345;
  border-radius: 50%;
  @mixin flex-center;
}
.main-slider-button-prev:hover,
.main-slider-button-next:hover {
  background-color: #0f2345;
}
.main-slider-button-prev:after,
.main-slider-button-next:after {
  content: '';
}
.main-slider-button-prev svg,
.main-slider-button-next svg {
  fill: #0f2345;
}
.main-slider-button-prev:hover svg,
.main-slider-button-next:hover svg {
  fill: #fff;
}
</style>
