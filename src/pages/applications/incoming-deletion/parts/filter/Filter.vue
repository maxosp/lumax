<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <div class="row">
      <TypesDropdown class="half-third" @setItem="val => changeFilter('object_type', val)" />
      <ModeratorDropdown class="half-third" @setItem="val => changeFilter('moderate_by', val)" />
      <StatusDropdown class="half-third" @setItem="val => changeFilter('status', val)" />
    </div>
    <div class="row">
      <CreatorDropdown class="half-third" @setItem="val => changeFilter('created_by', val)" />
      <div class="buttons half-third">
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
import * as dropdowns from '@/pages/applications/incoming-deletion/parts/filter/parts/dropdowns.index'
import { modules } from '@/pages/applications/incoming-deletion/parts/filter/parts/'
import {
  reset,
  toggleVisibility,
} from '@/pages/applications/incoming-deletion/parts/filter/filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'IncomingDeletionApplicationsFilter',
  components: {
    Icon,
    TypesDropdown: dropdowns.TypesDropdown,
    StatusDropdown: dropdowns.StatusDropdown,
    ModeratorDropdown: dropdowns.ModeratorDropdown,
    CreatorDropdown: dropdowns.CreatorDropdown,
    BaseButton,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
    filterParams: { type: Object, required: true },
  },
  data() {
    return {
      dropdownsFilter: { subject: null, study_year: null, created_by: null },
      // modules methods should be here for reset
      typesModuleMethods: modules.typesDropdownModule.methods,
      statusDropdownModule: modules.statusDropdownModule.methods,
      moderatorDropdownModule: modules.moderatorDropdownModule.methods,
      creatorDropdownModule: modules.creatorDropdownModule.methods,
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
    applyFilters() {
      const filter = {}
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
      this.typesModuleMethods.resetItem()
      this.statusDropdownModule.resetItem()
      this.moderatorDropdownModule.resetItem()
      this.creatorDropdownModule.resetItem()
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

.half-third {
  width: calc(100% / 3 - 20px);
  flex-shrink: 0;
}
.buttons {
  display: flex;
  align-items: flex-end;
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

