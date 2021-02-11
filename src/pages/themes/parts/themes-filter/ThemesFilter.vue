<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <div class="section">
      <SubjectsDropdown
        :module-methods="subjectsModuleMethods"
        @setItem="val => changeFilter('subject', val)"
      />
      <BaseSwitch
        class="switch"
        :checked="$togglers.hide_prerequisites"
        @change="val => {
          setToggler('hide_prerequisites', val)
          if (val) {
            setToggler('show_only_prerequisites', false)
          }
        }"
      >
        <p>Скрыть переквизиты</p>
      </BaseSwitch>
      <BaseSwitch
        class="switch"
        :checked="$togglers.show_only_prerequisites"
        @change="val => {
          setToggler('show_only_prerequisites', val)
          if (val) {
            setToggler('hide_prerequisites', false)
          }
        }"
      >
        <p>Отобразить только переквизиты</p>
      </BaseSwitch>
    </div>
    <div class="section">
      <ClassesDropdown
        :module-methods="classesModuleMethods"
        @setItem="val => changeFilter('study_year', val)"
      />
      <BaseSwitch
        class="switch"
        :checked="$togglers.show_without_tasks"
        @change="val => {
          setToggler('show_without_tasks', val)
          if (val) {
            setToggler('show_with_tasks', false)
          }
        }"
      >
        <p>Отобразить только темы без заданий</p>
      </BaseSwitch>
      <BaseSwitch
        class="switch"
        :checked="$togglers.show_with_tasks"
        @change="val => {
          setToggler('show_with_tasks', val)
          if (val) {
            setToggler('show_without_tasks', false)
          }
        }"
      >
        <p>Отобразить только темы с заданиями</p>
      </BaseSwitch>
    </div>
    <div class="section">
      <AuthorsDropdown
        :module-methods="authorsModuleMethods"
        @setItem="val => changeFilter('created_by', val)"
      />
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
import AuthorsDropdown from '@/pages/themes/parts/themes-filter/parts/authors-dropdown/AuthorsDropdown.vue'
import ClassesDropdown from '@/pages/themes/parts/themes-filter/parts/classes-dropdown/ClassesDropdown.vue'
import SubjectsDropdown from '@/pages/themes/parts/themes-filter/parts/subjects-dropdown/SubjectsDropdown.vue'
import { authorsDropdownModule } from '@/pages/themes/parts/themes-filter/parts/authors-dropdown/authors-dropdown.model'
import { classesDropdownModule } from '@/pages/themes/parts/themes-filter/parts/classes-dropdown/classes-dropdown.model'
import { subjectsDropdownModule } from '@/pages/themes/parts/themes-filter/parts/subjects-dropdown/subjects-dropdown.model'
import {
  $togglers,
  setTogglers,
  reset,
  toggleVisibility,
} from '@/pages/themes/parts/themes-filter/themes-filter.model'
import { mapTogglerToEntity } from '@/pages/themes/parts/themes-filter/constants'

Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})

export default Vue.extend({
  name: 'ThemesFilter',
  components: {
    Icon,
    BaseSwitch,
    BaseButton,
    AuthorsDropdown,
    ClassesDropdown,
    SubjectsDropdown,
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
      authorsModuleMethods: authorsDropdownModule.methods,
      classesModuleMethods: classesDropdownModule.methods,
      subjectsModuleMethods: subjectsDropdownModule.methods,
    }
  },
  methods: {
    toggleVisibility,
    closeFilter(event) {
      if (event.target.id !== 'filter-icon') {
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
      this.$emit('resetFilter')
      this.authorsModuleMethods.resetItem()
      this.classesModuleMethods.resetItem()
      this.subjectsModuleMethods.resetItem()
      reset()
      toggleVisibility(false)
    },
  },
})
</script>

<style>
.themes-filter {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  padding: 30px 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
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
}

.btn {
  width: max-content;
}

.borderless {
  border-color: transparent !important;
  text-decoration: underline;
}

.close-icon {
  cursor: pointer;
  position: relative;
  top: -10px;
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