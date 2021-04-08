<template>
  <GridPageHead title="Задания для уроков">
    <div class="buttons">
      <RouterLink :to="{ name: 'lesson-tasks-creation' }">
        <BaseButton
          class="btn"
          yellow
        >
          Создать задание
        </BaseButton>
      </RouterLink>
      <BaseButton
        class="btn btn_creating-theme"
        yellow
        @click="modalVisibilityChanged(true)"
      >
        Создать папку
      </BaseButton>
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
      <BaseButton class="btn">
        <div class="btn-content">
          <span>
            Выгрузить
          </span>
          <Divider vertical />
          <Icon type="settings" size="20" />
        </div>
      </BaseButton>
    </div>
  </GridPageHead>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import GridPageHead from '@/pages/common/grid-parts/GridPageHead.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import { loadModalForMultiChanges } from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'
import { modalVisibilityChanged } from '@/pages/common/modals/tasks-bank/creating-folder/creating-folder-modal.model'

export default Vue.extend({
  name: 'PageHeader',
  components: {
    BaseButton,
    Divider,
    Icon,
    GridPageHead,
  },
  props: {
    selectedRows: { type: Array as PropType<number[]> },
  },
  methods: { loadModalForMultiChanges, modalVisibilityChanged },
})
</script>

<style scoped>
.header {
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
  margin-right: 20px;
  .icon {
    fill: #fff;
    stroke: transparent;
  }
}
.btn-content {
  display: flex;
  align-items: center;
  & /deep/ .divider {
    margin: 0 10px;
    background-color: var(--c-dark-1);
  }
}
a,
.btn_creating-theme {
  margin-right: 15px;
}
a + .btn {
  padding-right: 10px;
  padding-left: 15px;
}
</style>
