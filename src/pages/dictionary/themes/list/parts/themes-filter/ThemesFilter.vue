<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <div class="section">
      <SubjectsDropdown @setItem="val => setItem({'subject': val})" />
      <BaseSwitch
        class="switch"
        :checked="!$filterParams.is_prerequisite"
        @change="setItem({'is_prerequisite': !$event})"
      >
        <p>Скрыть пререквизиты</p>
      </BaseSwitch>
      <BaseSwitch
        class="switch"
        :checked="$filterParams.is_prerequisite"
        @change="setItem({'is_prerequisite': $event})"
      >
        <p>Отобразить только пререквизиты</p>
      </BaseSwitch>
    </div>
    <div class="section">
      <ClassesDropdown @setItem="val => setItem({'study_year': val})" />
      <BaseSwitch
        class="switch"
        :checked="!$filterParams.has_assignment"
        @change="setItem({'has_assignment': !$event})"
      >
        <p>Отобразить только темы без заданий</p>
      </BaseSwitch>
      <BaseSwitch
        class="switch"
        :checked="$filterParams.has_assignment"
        @change="setItem({'has_assignment': $event})"
      >
        <p>Отобразить только темы с заданиями</p>
      </BaseSwitch>
    </div>
    <div class="section">
      <AuthorsDropdown @setItem="val => setItem({'created_by': val})" />
      <div class="buttons">
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
    <Icon
      type="close"
      class="close-icon"
      size="10"
      @click="toggleVisibility(false)"
    />
    <div class="arrow-up" />
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'

import {
  reset,
  themesFilters,
  toggleVisibility,
} from '@/pages/dictionary/themes/list/parts/themes-filter/themes-filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'
import { dropdownComponents } from '@/pages/dictionary/themes/list/parts/themes-filter/parts/dropdown-components'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ThemesFilter',
  components: {
    Icon,
    BaseSwitch,
    BaseButton,
    AuthorsDropdown: dropdownComponents.AuthorsDropdown,
    ClassesDropdown: dropdownComponents.ClassesDropdown,
    SubjectsDropdown: dropdownComponents.SubjectsDropdown,
  },
  effector: {
    $filterParams: themesFilters.store.$filterParams,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
  },
  methods: {
    toggleVisibility,
    closeFilter(event) {
      // check for close icon (clear filter dropdown)
      if (event.target.href && event.target.href.baseVal === '#close-icon') {
        return
      }
      // check for general filter icon
      if (!event.target.closest('#filter-icon')) {
        toggleVisibility(false)
      }
    },
    setItem(filter) {
      this.$emit('changeFilter', filter)
    },
    applyFilters() {
      this.$emit('setFilter')
      toggleVisibility(false)
    },
    resetFilters() {
      this.$emit('resetFilter') // general filter
      reset() // togglers and visibility
    },
  },
})
</script>

<style scoped>
.themes-filter {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  padding: 30px 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  & + .section {
    margin-left: 40px;
  }
}

.switch {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  & + .switch {
    margin-top: 15px;
  }
}

.buttons {
  display: flex;
  align-items: flex-start;
  margin-left: 0;
}

.btn {
  width: max-content;
}

.borderless {
  border-color: transparent !important;
  @mixin underline-text;
}

.close-icon {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  fill: var(--c-grey-3);
}

.arrow-up {
  @mixin arrow-up;
}
</style>
