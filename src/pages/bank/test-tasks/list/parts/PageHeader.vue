<template>
  <GridPageHead title="Тестовые задания">
    <div class="buttons">
      <RouterLink :to="{ name: 'test-tasks-create' }">
        <BaseButton
          class="btn"
          yellow
        >
          Создать задание
        </BaseButton>
      </RouterLink>
      <RouterLink :to="{ name: 'themes-create' }">
        <BaseButton
          class="btn"
          yellow
        >
          Создание темы
        </BaseButton>
      </RouterLink>
      <BaseButton
        class="btn --square"
        @click="loadModalForMultiChanges(selectedRows)"
      >
        <Icon
          type="edit"
          size="20"
          class="icon"
        />
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
  </GridPageHead>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import GridPageHead from '@/pages/common/grid-parts/GridPageHead.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Icon from '@/ui/icon/Icon.vue'
import { loadModalForMultiChanges } from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'
import HeaderPopup from '@/pages/common/parts/header/header-popup/HeaderPopup.vue'
import { TableField } from '@/pages/dictionary/themes/list/types'
import DownloadButton from '@/pages/common/parts/header/DownloadButton.vue'
import { testTaskPageParams } from '@/pages/bank/test-tasks/list/tasks-page.model'

export default Vue.extend({
  name: 'PageHeader',
  components: {
    DownloadButton,
    BaseButton,
    Icon,
    GridPageHead,
    HeaderPopup,
  },
  props: {
    tableColumns: { type: Array as PropType<TableField[]> },
    selectedRows: { type: Array as PropType<number[]> },
  },
  effector: {
    $treeView: testTaskPageParams.store.treeView,
  },
  methods: {
    loadModalForMultiChanges,
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

.btn {
  min-width: 130px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
}

.btn.--square {
  width: 40px;
  min-width: 40px;
  padding: 0;
  @mixin flex-center;
  .icon {
    fill: #fff;
    stroke: transparent;
  }
}
a {
  margin-right: 15px;
}
a + .btn {
  padding-right: 10px;
  padding-left: 15px;
}
</style>
