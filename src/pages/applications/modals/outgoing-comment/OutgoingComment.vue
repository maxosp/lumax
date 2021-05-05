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
    <MainSlider
      :current-slide="currentSlide"
      @onSlideClick="openFullSizeSlider"
    />
    <FullSizeSlider
      :is-visible="fullSizeSliderIsVisible"
      :current-slide="currentSlide"
      @onCloseFullSizeSlider="closeFullSizeSlider"
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
import FullSizeSlider from '@/pages/applications/modals/outgoing-comment/parts/FullsizeSlider.vue'
import {
  $modalVisibility,
  $selectedId,
  modalVisibilityChanged,
  $comment,
} from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/swiper-bundle.css'
import MainSlider from '@/pages/applications/modals/outgoing-comment/parts/MainSlider.vue'

SwiperCore.use([Navigation])

export default Vue.extend({
  name: 'CommentModal',
  components: {
    Modal,
    Icon,
    BaseButton,
    FullSizeSlider,
    MainSlider,
  },
  effector: {
    $modalVisibility,
    $selectedId,
    $comment,
  },
  data: () => ({
    currentSlide: 0,
    fullSizeSliderIsVisible: false,
  }),
  methods: {
    modalVisibilityChanged,
    openFullSizeSlider(clickedSlideIndex: number) {
      this.currentSlide = clickedSlideIndex
      this.fullSizeSliderIsVisible = true
    },
    closeFullSizeSlider(slideIndex: number) {
      this.currentSlide = slideIndex
      this.fullSizeSliderIsVisible = false
    },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  position: relative;
  width: 480px;
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
.btn {
  margin: 30px auto 0;
}
</style>
