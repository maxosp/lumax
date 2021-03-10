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
      <TypeDropdown class="half-second" @setItem="val => changeFilter('type', val)" />
      <StatusDropdown class="half-third" @setItem="val => changeFilter('status', val)" />
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
import * as dropdowns from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/dropdowns.index'
import { modules } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/'
import {
  reset,
  toggleVisibility,
  $togglers,
  setTogglers,
} from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/lesson-tasks-filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ThemesFilter',
  components: {
    Icon,
    StatusDropdown: dropdowns.StatusDropdown,
    TypeDropdown: dropdowns.TypeDropdown,
    BaseButton,
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
      dropdownsFilter: {},
      // modules methods should be here for reset
      typeDropdownModule: modules.typeDropdownModule.methods,
      statusDropdownModule: modules.statusDropdownModule.methods,
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
      this.$emit('setFilter', {
        ...this.$props.filterParams,
        ...filter,
      })
      toggleVisibility(false)
    },
    resetFilters() {
      this.dropdownsFilter = {}
      this.typeDropdownModule.resetItem()
      this.statusDropdownModule.resetItem()
      this.$emit('resetFilter') // general filter
      reset() // togglers and visibility
    },
  },
  mounted() {
    const container = document.querySelector('#lessons-page')
    container && container.addEventListener('reset-themes-filter', this.resetFilters, false)
  },
  beforeDestroy() {
    const container = document.querySelector('#lessons-page')
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
  width: calc(100% / 3 - 20px);
  margin-left: auto;
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
  position: relative;
  width: 0;
  height: 0;
  top: -40px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
}
.block {
  display: flex;
}
</style>
