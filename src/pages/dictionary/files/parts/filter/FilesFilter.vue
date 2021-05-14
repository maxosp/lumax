<template>
  <div
    v-click-outside="closeFilter"
    v-if="visible"
    class="filter"
  >
    <div class="arrow-up" />
    <BaseSwitch
      class="block"
      :checked="$filterParams.created_by_me"
      @change="setItem({'created_by_me': $event})"
    >
      <p>Созданные мной</p>
    </BaseSwitch>
    <div class="section">
      <div class="title"> Тип файла </div>
      <BaseCheckbox
        v-for="(item, index) in fileTypes"
        :key="index"
        class="filter-checkbox"
        :name="item.name"
        :value="$checkboxes[item.name]"
        @change="value => updateCheckboxes({ [item.name]: value })"
      >
        {{ item.title }}
      </BaseCheckbox>
    </div>
    <div class="section">
      <div class="btns">
        <div class="btn">
          <BaseButton
            small
            @click="applyFilters"
          >
            Применить
          </BaseButton>
        </div>
        <div class="btn">
          <BaseButton
            class="borderless"
            small
            border-without-bg
            @click="resetFilters"
          >
            Сбросить фильтры
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClickOutside from '@/features/directives/click-outside'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import { FiltersParams } from '@/pages/common/types'
import {
  filesFilters,
  toggleVisibility,
  reset,
  $checkboxes,
  updateCheckboxes,
} from '@/pages/dictionary/files/parts/filter/filter.model'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'FilesFilter',
  components: {
    BaseButton,
    BaseSwitch,
    BaseCheckbox,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
  },
  effector: {
    $filterParams: filesFilters.store.$filterParams,
    $checkboxes,
  },
  data: () => ({
    fileTypes: [
      { title: 'Документ', name: 'doc' },
      { title: 'Архив', name: 'zip' },
      { title: 'Картинка', name: 'img' },
      { title: 'Аудио', name: 'audio' },
      { title: 'Видео', name: 'video' },
      { title: 'Другое', name: 'file' },
    ],
  }),
  methods: {
    toggleVisibility,
    reset,
    updateCheckboxes,
    closeFilter({ target }: any) {
      // check for close icon (clear filter dropdown)
      if (target.href && target.href.baseVal === '#close-icon') {
        return
      }
      // check for general filter icon
      if (
        target.id !== 'filter-icon' &&
        target.parentElement &&
        target.parentElement.id !== 'filter-icon'
      ) {
        toggleVisibility(false)
      }
    },
    setItem(filter: FiltersParams) {
      this.$emit('changeFilter', filter)
    },
    applyFilters() {
      const ckbx = Object.entries(this.$checkboxes)
        .filter((el) => el[1])
        .map((el) => el[0])
      const res = ckbx.join(',')
      this.setItem({ file_type: res.length > 0 ? res : undefined })
      this.$emit('setFilter')
      toggleVisibility(false)
    },
    resetFilters() {
      this.$emit('resetFilter') // general filter
    },
  },
})
</script>

<style scoped>
.filter {
  position: absolute;
  top: 50px;
  right: 0;
  width: 240px;
  padding: 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
}
.block {
  margin-bottom: 20px;
}
.section {
  @mixin flex-row-central;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  .title {
    font-weight: 600;
    line-height: 14px;
    margin-bottom: 10px;
  }
  .filter-checkbox:not(:last-child) {
    margin-bottom: 20px;
  }
}

.btns {
  width: 100%;
  @mixin flex-column-central;
  justify-content: flex-start;
  margin-top: 20px;
  .btn,
  .btn button {
    width: 100%;
  }
  .btn:first-child {
    margin-bottom: 10px;
  }
  .borderless {
    border: none;
    @mixin underline-text;
  }
}
.arrow-up {
  @mixin arrow-up;
}
</style>
