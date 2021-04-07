<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <div class="row">
      <SubjectsDropdown class="half-third" @setItem="val => setItem({'subject': val})" />
      <ClassesDropdown class="half-third" @setItem="val => setItem({'study_year': val})" />
      <StatusDropdown class="half-third" @setItem="val => setItem({'status': val})" />
    </div>
    <div class="row">
      <ModeratorDropdown class="half-third" @setItem="val => setItem({'moderate_by': val})" />
      <div class="buttons half-second">
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
import { reset, toggleVisibility } from '@/pages/applications/outgoing/parts/filter/filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'
import { dropdownComponents } from '@/pages/applications/outgoing/parts/filter/parts/dropdown-components'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'OutgoingApplicationsFilter',
  components: {
    Icon,
    ClassesDropdown: dropdownComponents.ClassesDropdown,
    SubjectsDropdown: dropdownComponents.SubjectsDropdown,
    StatusDropdown: dropdownComponents.StatusDropdown,
    ModeratorDropdown: dropdownComponents.ModeratorDropdown,
    BaseButton,
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
}

.half-third {
  width: calc(100% / 3 - 20px);
  flex-shrink: 0;
}
.buttons {
  display: flex;
  align-items: flex-end;
  width: calc(100% / 3 - 20px);
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

