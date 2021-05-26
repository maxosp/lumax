<template>
  <div class="header">
    <div class="title"> Теги для олимпиадных заданий </div>
    <div class="buttons">
      <BaseSwitch
        class="switch"
        :checked="$treeView"
        @change="toggleTreeView"
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
      <DownloadButton
        v-if="!$treeView"
      />
    </div>

    <HeaderPopup
      class="popup"
      :table-columns="tableColumns"
      @onExport="$emit('onExport')"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import HeaderPopup from '@/pages/common/parts/header/header-popup/HeaderPopup.vue'
import DownloadButton from '@/pages/common/parts/header/DownloadButton.vue'
import { TableField } from '@/pages/dictionary/themes/list/types'
import { tagsPageParams } from '@/pages/tags/tags-page.model'

export default Vue.extend({
  components: {
    BaseSwitch,
    BaseButton,
    DownloadButton,
    HeaderPopup,
  },
  props: {
    tableColumns: { type: Array as PropType<TableField[]> },
  },
  effector: {
    $treeView: tagsPageParams.store.treeView,
  },
  methods: {
    toggleTreeView: tagsPageParams.methods.toggleTreeView,
  },
})
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 58px;
  border-radius: 3px;
  @mixin flex-row-central;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
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
}
</style>
