<template>
  <BaseButton
    id="btn-download"
    @click="changeExportPopupVisibility(true)"
  >
    <div class="btn__content">
      <span class="btn__text">
        Выгрузить
      </span>
      <Divider vertical />
      <div
        class="btn__icon"
        :class="{'active': $exportPopupVisibility}"
      >
        <Icon type="settings" size="20" />
      </div>
    </div>
  </BaseButton>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  $exportPopupVisibility,
  changeExportPopupVisibility,
} from '@/pages/common/parts/header/header-popup/header-popup.model'

export default Vue.extend({
  name: 'DownloadButton',
  components: {
    BaseButton,
    Divider,
    Icon,
  },
  effector: {
    $exportPopupVisibility,
  },
  methods: { changeExportPopupVisibility },
})
</script>

<style scoped>
#btn-download {
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  margin-left: 15px;
}
.btn__content {
  display: flex;
  align-items: center;
  & /deep/ {
    .btn__text {
      @mixin flex-center;
      height: 100%;
      padding: 0 15px;
    }
    .divider {
      background-color: var(--c-dark-1);
    }
    .btn__icon {
      @mixin flex-center;
      height: 100%;
      padding: 0 10px;
      &.active {
        background-color: var(--c-dark-1);
      }
    }
  }
}
</style>
