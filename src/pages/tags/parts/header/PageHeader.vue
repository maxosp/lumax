<template>
  <div class="header">
    <div class="title"> Теги для олимпиадных заданий </div>
    <div class="buttons">
      <BaseSwitch
        class="switch"
        :checked="$treeView"
        @change="treeViewChanged"
      >
        <span> Дерево </span>
      </BaseSwitch>
      <BaseButton
        class="btn"
        yellow
        @click="modalVisibilityChanged(true)"
      >
        Добавить тег
      </BaseButton>
      <BaseButton
        v-if="!$treeView"
        id="btn-download"
        class="btn"
      >
        <div
          class="btn-content"
          @click="showPopup = true"
        >
          <span>
            Выгрузить
          </span>
          <Divider vertical height="40px" />
          <Icon
            type="settings"
            size="20"
          />
        </div>
      </BaseButton>
    </div>
    <HeaderPopup
      class="popup"
      :table-columns-names="tableColumnsNames"
      :visibility="showPopup"
      @close="showPopup = false"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import HeaderPopup from '@/pages/tags/parts/header/header-popup/HeaderPopup.vue'
import { $treeView, treeViewChanged } from '@/pages/tags/parts/header/page-header.model'
import { modalVisibilityChanged } from '@/pages/tags/parts/modals/tag-creation/tag-creation.modal'
import { TableField } from '@/pages/dictionary/themes/list/types'

export default Vue.extend({
  components: {
    BaseSwitch,
    BaseButton,
    Divider,
    Icon,
    HeaderPopup,
  },
  props: {
    tableColumnsNames: { type: Array as PropType<TableField[]> },
  },
  effector: {
    $treeView,
  },
  data() {
    return {
      showPopup: false,
    }
  },
  methods: {
    treeViewChanged,
    modalVisibilityChanged,
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 58px;
  border-radius: 3px;
  @mixin flex-row-central;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  position: relative;
}
.title {
  font-size: 20px;
  line-height: 18px;
  font-weight: 700;
  color: var(--base-text-primary);
}
.buttons {
  @mixin flex-row-central;
  .switch {
    margin-right: 20px;
    margin-top: 0;
  }
  .btn {
    min-width: 130px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }
  .btn:last-child {
    padding: 0 10px 0 15px;
    margin-left: 20px;
  }
  .btn-content {
    display: flex;
    align-items: center;
    & /deep/ .divider {
      margin: 0 10px;
      background-color: var(--c-dark-1);
    }
  }
}
.popup {
  position: absolute;
  top: 0;
  right: 65px;
}
</style>
