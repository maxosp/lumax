<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <BaseSwitch
      class="block"
      :checked="$togglers.created_by_me"
      @change="setToggler('created_by_me', $event)"
    >
      <p>Созданные мной</p>
    </BaseSwitch>
    <div class="row">
      <SubjectsDropdown class="half-third" @setItem="val => changeFilter('subject', val)" />
      <ClassesDropdown class="half-third" @setItem="val => changeFilter('study_year', val)" />
      <DifficultyDropdown class="half-third" @setItem="val => changeFilter('difficulty', val)" />
    </div>
    <div class="row">
      <TypeDropdown class="half-second" @setItem="val => changeFilter('type', val)" />
      <StatusDropdown class="half-third" @setItem="val => changeFilter('status', val)" />
    </div>
    <div class="row">
      <TagsDropdown class="half-second" @setItem="val => changeFilter('tags', val)" />
      <LanguageDropdown class="half-third" @setItem="val => changeFilter('interface_language', val)" />
    </div>
    <div class="row">
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
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import * as dropdowns from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/dropdowns.index'
import { modules } from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/'
import {
  reset,
  toggleVisibility,
  $togglers,
  setTogglers,
} from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/tasks-filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'TasksFilter',
  components: {
    Icon,
    ClassesDropdown: dropdowns.ClassesDropdown,
    SubjectsDropdown: dropdowns.SubjectsDropdown,
    DifficultyDropdown: dropdowns.DifficultyDropdown,
    StatusDropdown: dropdowns.StatusDropdown,
    TypeDropdown: dropdowns.TypeDropdown,
    LanguageDropdown: dropdowns.LanguageDropdown,
    BaseButton,
    TagsDropdown: dropdowns.TagsDropdown,
    BaseSwitch,
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
      difficultyDropdownModule: modules.difficultyDropdownModule.methods,
      classesModuleMethods: modules.classesDropdownModule.methods,
      subjectsModuleMethods: modules.subjectsDropdownModule.methods,
      statusDropdownModule: modules.statusDropdownModule.methods,
      typeDropdownModule: modules.typeDropdownModule.methods,
      languagesDropdownModule: modules.languagesDropdownModule.methods,
      tagsDropdownModule: modules.tagsDropdownModule.methods,
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
    changeFilter(name, value) {
      this.dropdownsFilter = { ...this.dropdownsFilter, [name]: value }
    },
    setToggler(name, value) {
      setTogglers({
        ...this.$togglers,
        [name]: value,
      })
    },
    applyFilters() {
      // set switchers values to filter
      const filter = {}
      Object.keys(this.$togglers).forEach((toggler) => {
        if (this.$togglers[toggler]) filter[toggler] = this.$togglers[toggler]
        else if (this.$props.filterParams.hasOwnProperty(toggler))
          delete this.$props.filterParams[toggler]
      })
      // set dropdowns value to filter
      Object.keys(this.dropdownsFilter).forEach((dropdownFilterKey) => {
        if (this.dropdownsFilter[dropdownFilterKey]) {
          filter[dropdownFilterKey] = this.dropdownsFilter[dropdownFilterKey]
        } else if (this.$props.filterParams.hasOwnProperty(dropdownFilterKey)) {
          delete this.$props.filterParams[dropdownFilterKey]
        }
      })
      // call table filter
      this.$emit('setFilter', filter)
      toggleVisibility(false)
    },
    resetFilters() {
      this.dropdownsFilter = {}
      this.classesModuleMethods.resetItem()
      this.subjectsModuleMethods.resetItem()
      this.difficultyDropdownModule.resetItem()
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
.row:last-of-type {
  justify-content: flex-end;
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
  width: calc(100% / 3 - 20px);
  margin-left: 30px;
  flex-shrink: 0;
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
  @mixin arrow-up;
}
.block {
  display: flex;
}
</style>

