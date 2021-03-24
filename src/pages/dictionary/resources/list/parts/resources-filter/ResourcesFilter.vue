<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="resources-filter"
  >
    <div class="section">
      <BaseSwitch
        class="switch"
        :checked="$createdByMe"
        @change="createdByMeChanged"
      >
        <p>Созданные мной</p>
      </BaseSwitch>
    </div>
    <div class="section">
      <TypeDropdown @setItem="val => changeFilter('type', val)" />
      <ThemeDropdown is-preload @setItem="val => changeFilter('theme', val)" />
    </div>
    <div class="section">
      <SubjectDropdown @setItem="val => changeFilter('subject', val)" />
      <ClassDropdown @setItem="val => changeFilter('study_year', val)" />
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
import ClassDropdown from '@/pages/common/dropdowns/class/classes-dropdown/ClassesDropdown.vue'
import SubjectDropdown from '@/pages/common/dropdowns/subject/subjects-dropdown/SubjectsDropdown.vue'
import ThemeDropdown from '@/pages/common/dropdowns/themes-tree/ThemeDropdown.vue'
import TypeDropdown from '@/pages/dictionary/resources/list/parts/resources-filter/parts/type/TypeDropdown.vue'
import { classesDropdownModule } from '@/pages/common/dropdowns/class/classes-dropdown/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/common/dropdowns/subject/subjects-dropdown/subjects-dropdown.model'
import { themesDropdownModule } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { typeDropdownModule } from '@/pages/dictionary/resources/list/parts/resources-filter/parts/type/type-dropdown.model'
import {
  $createdByMe,
  createdByMeChanged,
  reset,
  toggleVisibility,
} from '@/pages/dictionary/resources/list/parts/resources-filter/resources-filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ResourcesFilter',
  components: {
    Icon,
    BaseSwitch,
    BaseButton,
    ClassDropdown,
    SubjectDropdown,
    ThemeDropdown,
    TypeDropdown,
  },
  effector: {
    $createdByMe,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
    filterParams: { type: Object, required: true },
  },
  data() {
    return {
      dropdownsFilter: { subject: null, study_year: null, created_by: null },
      // modules methods should be here for reset
      classModuleMethods: classesDropdownModule.methods,
      subjectModuleMethods: subjectsDropdownModule.methods,
      themeModuleMethods: themesDropdownModule.methods,
      typeModuleMethods: typeDropdownModule.methods,
    }
  },
  methods: {
    toggleVisibility,
    createdByMeChanged,
    closeFilter(event) {
      // check for close icon (clear filter dropdown)
      if (event.target.href && event.target.href.baseVal === '#close-icon') {
        return
      }
      // check for general filter icon
      if (
        event.target.id !== 'filter-icon' &&
        event.target.parentElement &&
        event.target.parentElement.id !== 'filter-icon'
      ) {
        toggleVisibility(false)
      }
    },
    changeFilter(name, value) {
      this.dropdownsFilter = { ...this.dropdownsFilter, [name]: value }
    },
    applyFilters() {
      // set switchers values to filter
      const filter = {}
      if (this.$createdByMe) filter.created_by_me = this.$createdByMe
      // set dropdowns value to filter
      Object.keys(this.dropdownsFilter).forEach((dropdownFilterKey) => {
        if (this.dropdownsFilter[dropdownFilterKey]) {
          filter[dropdownFilterKey] = this.dropdownsFilter[dropdownFilterKey]
        }
      })
      // call table filter
      this.$emit('setFilter', filter)
      toggleVisibility(false)
    },
    resetFilters() {
      this.dropdownsFilter = {}
      this.classModuleMethods.resetItem()
      this.subjectModuleMethods.resetItem()
      this.themeModuleMethods.resetItem()
      this.typeModuleMethods.resetItem()
      this.createdByMeChanged(false)
      this.$emit('resetFilter') // general filter
      reset() // togglers and visibility
    },
  },
  mounted() {
    const container = document.querySelector('#resources-page')
    container && container.addEventListener('reset-resources-filter', this.resetFilters, false)
  },
  beforeDestroy() {
    const container = document.querySelector('#resources-page')
    container && container.removeEventListener('reset-resources-filter', this.resetFilters, false)
    // TO DO: update resetting of class & subject dd when resetfilters is updated
    this.classModuleMethods.resetItem()
    this.subjectModuleMethods.resetItem()
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
