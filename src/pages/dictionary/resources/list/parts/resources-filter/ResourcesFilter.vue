<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="resources-filter"
  >
    <div class="section">
      <BaseSwitch
        class="switch"
        :checked="$filterParams.created_by_me"
        @change="setItem({'created_by_me': $event})"
      >
        <p>Созданные мной</p>
      </BaseSwitch>
    </div>
    <div class="section">
      <TypeDropdown @setItem="val => setItem({'type': val})" />
      <ThemeDropdown is-preload @setItem="val => setItem({'theme': val})" />
    </div>
    <div class="section">
      <SubjectDropdown @setItem="val => setItem({'subject': val})" />
      <ClassDropdown @setItem="val => setItem({'study_year': val})" />
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
  resourcesFilters,
  toggleVisibility,
} from '@/pages/dictionary/resources/list/parts/resources-filter/resources-filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'
import { dropdownComponents } from '@/pages/dictionary/resources/list/parts/resources-filter/parts/dropdown-components'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ResourcesFilter',
  components: {
    Icon,
    BaseSwitch,
    BaseButton,
    ClassDropdown: dropdownComponents.ClassDropdown,
    SubjectDropdown: dropdownComponents.SubjectDropdown,
    ThemeDropdown: dropdownComponents.ThemeDropdown,
    TypeDropdown: dropdownComponents.TypeDropdown,
  },
  effector: {
    $filterParams: resourcesFilters.store.$filterParams,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
  },
  methods: {
    toggleVisibility,
    closeFilter(event) {
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
.resources-filter {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
}

.section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  .dropdown:first-child {
    margin-bottom: 20px;
  }
}

.section:first-child {
  width: 100%;
  margin-bottom: 20px;
}
.section:nth-child(2) {
  width: calc((100% - 40px) / 3 * 2);
  max-width: 720px;
}
.section:nth-child(3) {
  width: calc((100% - 40px) / 3);
  max-width: 360px;
  margin-left: 40px;
}

.switch {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.buttons {
  display: flex;
  margin-top: 20px;
}

.btn {
  width: max-content;
}

.borderless {
  border-color: transparent !important;
  @mixin underline-text;
  margin-left: 20px;
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
