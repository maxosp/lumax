<template>
  <div class="header">
    <div class="title"> Олимпиадные задания </div>
    <div class="buttons">
      <RouterLink :to="{ name: 'olympiad-tasks-create' }">
        <BaseButton
          class="btn"
          yellow
        >
          Создать задание
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
      <BaseButton
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
          <Divider vertical />
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
import BaseButton from '@/ui/button/BaseButton.vue'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'
import HeaderPopup from '@/pages/bank/olympiad-tasks/list/parts/header/header-popup/HeaderPopup.vue'
import { TableField } from '@/pages/dictionary/themes/list/types'
import { loadModalForMultiChanges } from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'

export default Vue.extend({
  components: {
    BaseButton,
    Divider,
    Icon,
    HeaderPopup,
  },
  props: {
    tableColumnsNames: { type: Array as PropType<TableField[]> },
    selectedRows: { type: Array as PropType<number[]> },
  },
  data() {
    return {
      showPopup: false,
    }
  },
  methods: { loadModalForMultiChanges },
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
    margin-right: 20px;
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
