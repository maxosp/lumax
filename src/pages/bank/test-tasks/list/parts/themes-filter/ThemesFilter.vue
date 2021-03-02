<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <div class="row">
      <SubjectsDropdown class="half-third" @setItem="val => changeFilter('subject', val)" />
      <ClassesDropdown class="half-third" @setItem="val => changeFilter('study_year', val)" />
      <DifficultyDropdown class="half-third" @setItem="val => changeFilter('study_year', val)" />
    </div>
    <div class="row">
      <ThemeDropdown class="half-second" @setItem="val => changeFilter('subject', val)" />
      <StatusDropdown class="half-third" @setItem="val => changeFilter('study_year', val)" />
    </div>
    <div class="row">
      <TypeDropdown class="half-second" @setItem="val => changeFilter('theme', val)" />
      <LanguageDropdown class="half-third" @setItem="val => changeFilter('study_year', val)" />
    </div>
    <div class="row">
      <TagsDropdown class="half-second" @setItem="val => changeFilter('theme', val)" />
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
import BaseButton from '@/ui/button/BaseButton.vue'
import ClassesDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/classes-dropdown/ClassesDropdown.vue'
import SubjectsDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/subjects-dropdown/SubjectsDropdown.vue'
import DifficultyDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/difficulty-dropdown/DifficultyDropdown.vue'
import ThemeDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/theme-dropdown/ThemeDropdown.vue'
import StatusDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/status-dropdown/StatusDropdown.vue'
import TypeDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/type-dropdown/TypeDropdown.vue'
import LanguageDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/language-dropdown/LanguageDropdown.vue'
import TagsDropdown from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/tags-dropdown/TagsDropdown.vue'
import { classesDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/classes-dropdown/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/subjects-dropdown/subjects-dropdown.model'
import { difficultyDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/difficulty-dropdown/difficulty-dropdown.model'
import { themesDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/theme-dropdown/theme-dropdown.model'
import { statusDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/status-dropdown/status-dropdown.model'
import { typeDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/type-dropdown/type-dropdown.model'
import { languagesDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/language-dropdown/language-dropdown.model'
import { tagsDropdownModule } from '@/pages/bank/test-tasks/list/parts/themes-filter/parts/tags-dropdown/tags-dropdown.model'
import {
  $togglers,
  setTogglers,
  reset,
  toggleVisibility,
} from '@/pages/bank/test-tasks/list/parts/themes-filter/themes-filter.model'
import { mapTogglerToEntity } from '@/pages/bank/test-tasks/list/parts/themes-filter/constants'
import ClickOutside from '@/features/directives/click-outside.ts'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ThemesFilter',
  components: {
    Icon,
    ClassesDropdown,
    SubjectsDropdown,
    DifficultyDropdown,
    ThemeDropdown,
    StatusDropdown,
    TypeDropdown,
    LanguageDropdown,
    BaseButton,
    TagsDropdown,
  },
  effector: {
    $togglers,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
    filterParams: { type: Object, required: true },
  },
  data() {
    return {
      dropdownsFilter: { subject: null, study_year: null, created_by: null },
      // modules methods should be here for reset
      difficultyDropdownModule: difficultyDropdownModule.methods,
      classesModuleMethods: classesDropdownModule.methods,
      subjectsModuleMethods: subjectsDropdownModule.methods,
      themesDropdownModule: themesDropdownModule.methods,
      statusDropdownModule: statusDropdownModule.methods,
      typeDropdownModule: typeDropdownModule.methods,
      languagesDropdownModule: languagesDropdownModule.methods,
      tagsDropdownModule: tagsDropdownModule.methods,
    }
  },
  methods: {
    toggleVisibility,
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
    setToggler(name, value) {
      setTogglers({
        ...this.$togglers,
        [name]: value,
      })
    },
    changeFilter(name, value) {
      this.dropdownsFilter = { ...this.dropdownsFilter, [name]: value }
    },
    applyFilters() {
      // set switchers values to filter
      const filter = {}
      Object.keys(this.$togglers).forEach((toggler) => {
        if (this.$togglers[toggler]) {
          const togglerEntity = mapTogglerToEntity[toggler]
          filter[togglerEntity.name] = togglerEntity.value
        }
      })
      // set dropdowns value to filter
      Object.keys(this.dropdownsFilter).forEach((dropdownFilterKey) => {
        if (this.dropdownsFilter[dropdownFilterKey]) {
          filter[dropdownFilterKey] = this.dropdownsFilter[dropdownFilterKey]
        }
      })
      // call table filter
      this.$emit('setFilter', {
        ...this.$props.filterParams,
        ...filter,
      })
      toggleVisibility(false)
    },
    resetFilters() {
      this.dropdownsFilter = {}

      this.classesModuleMethods.resetItem()
      this.subjectsModuleMethods.resetItem()
      this.difficultyDropdownModule.resetItem()
      this.themesDropdownModule.resetItem()
      this.statusDropdownModule.resetItem()
      this.typeDropdownModule.resetItem()
      this.languagesDropdownModule.resetItem()
      this.tagsDropdownModule.resetItem()
      this.$emit('resetFilter') // general filter
      reset() // togglers and visibility
    },
  },
  mounted() {
    const container = document.querySelector('#themes-page')
    container && container.addEventListener('reset-themes-filter', this.resetFilters, false)
  },
  beforeDestroy() {
    const container = document.querySelector('#themes-page')
    container && container.removeEventListener('reset-themes-filter', this.resetFilters, false)
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
  flex-direction: column;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  .row {
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
  .close-icon {
    position: absolute;
    top: 21px;
    right: 21px;
  }
}

.row {
  display: flex;
  justify-content: space-between;
}

.half-second {
  width: 100%;
  margin-right: 30px;
}

.half-third {
  width: calc(100% / 3 - 20px);
  flex-shrink: 0;
}
.buttons {
  display: flex;
  align-items: flex-end;
  margin-left: auto;
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
  fill: var(--c-grey-3);
}

.arrow-up {
  position: relative;
  width: 0;
  height: 0;
  top: -40px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
}
</style>
