<template>
  <div class="header">
    <div class="title"> Входящие заявки на удаление </div>
    <div class="buttons">
      <DownloadButton />
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
import {
  $assignedToMe,
  assignedToMeChanged,
} from '@/pages/applications/incoming-deletion/parts/header/page-header.model'
import DownloadButton from '@/pages/common/parts/header/DownloadButton.vue'
import HeaderPopup from '@/pages/common/parts/header/header-popup/HeaderPopup.vue'
import { TableField } from '@/pages/dictionary/themes/list/types'

export default Vue.extend({
  components: {
    DownloadButton,
    HeaderPopup,
  },
  effector: {
    $assignedToMe,
  },
  props: {
    tableColumns: { type: Array as PropType<TableField[]> },
  },
  methods: { assignedToMeChanged },
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
  width: fit-content;
  .switch {
    margin-top: 0;
  }
  .btn {
    min-width: 130px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    white-space: nowrap;
  }
  .btn.--square {
    width: 40px;
    min-width: 40px;
    padding: 0;
    @mixin flex-center;
    margin-left: 20px;
    .icon {
      fill: #fff;
      stroke: transparent;
    }
  }
}
</style>
