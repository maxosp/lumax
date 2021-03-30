<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Комментарий к заявке по заданию №{{ $selectedId }} </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <div class="text">
      {{ $comment }}
    </div>
    <Swiper ref="swiper" :options="swiperOptions">
      <SwiperSlide
        v-for="(img, i) in $images"
        :key="img.id"
        class="slide"
      >
        <div
          :data-index="i"
          :style="{backgroundImage: `url('${img.file}')`}"
          class="slide image"
          @click="setFullSizeCarousel"
        />
      </SwiperSlide>
      <div class="swiper-button-prev" />
      <div class="swiper-button-next" />
    </Swiper>
    <FullsizeCarousel
      v-if="showDialog"
      :currentSlide="currentSlide"
      :slides="$images"
    />
    <BaseButton
      small
      class="btn"
      @click="modalVisibilityChanged(false)"
    >
      Закрыть
    </BaseButton>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import FullsizeCarousel from '@/pages/applications/modals/outgoing-comment/parts/FullsizeCarousel.vue'
import {
  $modalVisibility,
  $selectedId,
  modalVisibilityChanged,
  $comment,
  $images,
} from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default Vue.extend({
  name: 'CommentModal',
  components: {
    Modal,
    Icon,
    BaseButton,
    FullsizeCarousel,
    Swiper,
    SwiperSlide,
  },
  effector: {
    $modalVisibility,
    $selectedId,
    $comment,
    $images,
  },
  data: () => ({
    showDialog: false,
    currentSlide: 0,
  }),
  computed: {
    swiperOptions() {
      return {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }
    },
  },
  methods: {
    modalVisibilityChanged,
    setFullSizeCarousel(e: any) {
      this.currentSlide = +e.target.getAttribute('data-index') + 1
      this.showDialog = true
    },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
  padding: 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 30px;
  .title {
    font-size: 18px;
    line-height: 22px;
  }
  .icon {
    fill: var(--c-grey-3);
    &:hover {
      cursor: pointer;
    }
  }
}
.text {
  line-height: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.carousel {
  margin-bottom: 30px;
}
.slide.image {
  width: 69px;
  height: 80px;
  background-size: cover;
  background-position: center;
}
.btn {
  margin: 30px auto 0;
}
</style>
