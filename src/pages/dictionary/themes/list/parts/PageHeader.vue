<template>
  <div class="header">
    <span class="title">Темы</span>
    <div class="buttons">
      <RouterLink :to="{ name: 'themes-create' }">
        <BaseButton
          class="btn btn_theme-create"
          yellow
        >
          Создать тему
        </BaseButton>
      </RouterLink>
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
import BaseButton from '@/ui/button/BaseButton.vue'
import { TableField } from '@/pages/dictionary/themes/list/types'
import HeaderPopup from '@/pages/common/parts/header/header-popup/HeaderPopup.vue'
import DownloadButton from '@/pages/common/parts/header/DownloadButton.vue'

export default Vue.extend({
  name: 'PageHeader',
  components: {
    BaseButton,
    HeaderPopup,
    DownloadButton,
  },
  props: {
    tableColumns: { type: Array as PropType<TableField[]> },
  },
})
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}

.title {
  color: var(--base-text-primary);
  font-size: 20px;
  font-weight: bold;
}

.buttons {
  display: flex;
}

.btn_theme-create {
  min-width: 130px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  padding-right: 10px;
  padding-left: 15px;
}
</style>
