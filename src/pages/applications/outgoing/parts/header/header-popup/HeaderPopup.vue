<template>
  <div
    v-click-outside="clickOutside"
    v-if="visibility"
    class="header-popup"
  >
    <BaseSwitch
      class="switch"
      :checked="$selectAll"
      @change="selectAllChanged"
    >
      <p class="text"> Выбрать все </p>
    </BaseSwitch>
    <p class="text"> Выберите нужные столбцы </p>
    <div class="ckbx">
      <BaseCheckbox
        v-for="(item, index) in filteredColumnsNames"
        :key="index"
        :name="item.name"
        option="reorder"
        class="checkbox"
      >
        {{ item.title }}
      </BaseCheckbox>
    </div>
    <p
      class="text --underline"
      @click="clearFields"
    >
      Сбросить фильтры
    </p>
    <BaseButton
      class="btn"
      @click="handleClick"
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
  $selectAll,
  selectAllChanged,
  download,
} from '@/pages/applications/outgoing/parts/header/header-popup/header-popup.model'

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
    tableColumnsNames: { type: Array as PropType<TableField[]> },
    visibility: { type: Boolean as PropType<boolean> },
  },
  effector: {
    $selectAll,
  },
  computed: {
    filteredColumnsNames() {
      return this.tableColumnsNames.filter((el) => el.title.length > 0)
    },
  },
  watch: {
    $selectAll: {
      handler(newVal) {
        Array.from(document.querySelectorAll('.header-popup input')).forEach(
          (el: any) => (el.checked = newVal)
        )
      },
    },
  },
  methods: {
    selectAllChanged,
    download,
    clickOutside(evt: any) {
      // eslint-disable-next-line no-useless-return
      if (evt.target.closest('#btn-download')) return
      this.$emit('close')
    },
    clearFields() {
      Array.from(document.querySelectorAll('.header-popup input:checked')).forEach(
        (el: any) => (el.checked = false)
      )
    },
    handleClick() {
      download()
      this.$emit('close')
    },
  },
})
</script>

<style scoped>
.header-popup {
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
