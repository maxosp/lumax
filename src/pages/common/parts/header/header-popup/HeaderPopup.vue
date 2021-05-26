<template>
  <div
    v-click-outside="clickOutside"
    v-if="$exportPopupVisibility"
    class="header-popup"
  >
    <BaseSwitch
      class="switch"
      :checked="$allSelected"
      @change="toggleSelectAll"
    >
      <p class="text"> Выбрать все </p>
    </BaseSwitch>
    <p class="text"> Выберите нужные столбцы </p>
    <div class="ckbx">
      <BaseCheckbox
        v-for="(value, key, index) in $exportColumns"
        :key="index"
        :name="key"
        :value="value"
        option="reorder"
        class="checkbox"
        @change="changeTestAssignmentsExportColumns({[key]: $event})"
      >
        {{ $exportColumnsNames[key] }}
      </BaseCheckbox>
    </div>
    <p
      class="text --underline"
      @click="uncheckAll"
    >
      Сбросить фильтры
    </p>
    <BaseButton
      class="btn"
      @click="$emit('onExport')"
    >
      Выгрузить
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import { TableField } from '@/pages/dictionary/themes/list/types'
import {
  $exportPopupVisibility,
  changeExportPopupVisibility,
  $allSelected,
  toggleSelectAll,
  changeTestAssignmentsExportColumns,
  uncheckAll,
  $exportColumns,
  $exportColumnsNames,
  initExportPopupStores,
  exportPopupDestroy,
} from '@/pages/common/parts/header/header-popup/header-popup.model'

const ClickOutside = require('vue-click-outside')

export default Vue.extend({
  name: 'HeaderPopup',
  components: {
    BaseSwitch,
    BaseCheckbox,
    BaseButton,
  },
  directives: {
    ClickOutside,
  },
  props: {
    tableColumns: { type: Array as PropType<TableField[]> },
    visibility: { type: Boolean as PropType<boolean> },
  },
  effector: {
    $exportPopupVisibility,
    $allSelected,
    $exportColumns,
    $exportColumnsNames,
  },
  methods: {
    toggleSelectAll,
    changeTestAssignmentsExportColumns,
    uncheckAll,
    clickOutside(evt: any) {
      if (evt.target.closest('#btn-download')) return
      changeExportPopupVisibility(false)
    },
  },
  mounted() {
    initExportPopupStores(this.tableColumns)
  },
  beforeDestroy() {
    exportPopupDestroy()
  },
})
</script>

<style scoped>
.header-popup {
  position: absolute;
  top: 5px;
  right: 65px;
  background-color: #fff;
  padding: 20px;
  border-radius: 7px;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  z-index: 200;
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 19px;
    right: -10px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #fff;
  }
  .switch {
    margin-top: 0;
    margin-bottom: 20px;
    .text {
      margin-bottom: 0;
    }
    & ::v-deep label {
      justify-content: flex-start;
    }
  }
  .text {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 10px;
  }
  .ckbx {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .checkbox {
      margin-bottom: 20px;
      & ::v-deep span.text {
        font-size: 14px;
        line-heght: 18px;
      }
    }
  }
  .text.--underline {
    text-align: center;
    font-weight: 400;
    @mixin underline-text;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .btn {
    width: 100%;
  }
}
</style>
