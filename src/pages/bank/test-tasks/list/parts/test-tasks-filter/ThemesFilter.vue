<template>
  <div
    v-click-outside="closeFilter"
    v-if="$props.visible"
    class="themes-filter"
  >
    <BaseSwitch
      class="block"
      :checked="$filterParams.created_by_me"
      @change="setItem({'created_by_me': $event})"
    >
      <p>Созданные мной</p>
    </BaseSwitch>
    <div class="row">
      <SubjectsDropdown class="half-third" @setItem="val => setItem({'subject': val})" />
      <ClassesDropdown class="half-third" @setItem="val => setItem({'study_year': val})" />
      <DifficultyDropdown class="half-third" @setItem="val => setItem({'difficulty': val})" />
    </div>
    <div class="row">
      <ThemeDropdown
        class="half-second"
        :is-disabled="!$canSetThemePosition"
        @setItem="val => setItem({'theme': val})"
      />
      <StatusDropdown class="half-third" @setItem="val => setItem({'status': val})" />
    </div>
    <div class="row">
      <TypeDropdown class="half-second" @setItem="val => setItem({'type': val})" />
      <LanguageDropdown class="half-third" @setItem="val => setItem({'interface_language': val})" />
    </div>
    <div class="row">
      <LabelsDropdown class="half-second" @setItem="val => setItem({'labels': val})" />
      <div class="labels-input-relative-align">
        <BaseSwitch
          class="switch"
          :checked="$filterParams.is_prerequisite"
          @change="setItem({'is_prerequisite': $event})"
        >
          <p>Пререквизит</p>
        </BaseSwitch>
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
import { dropdownComponents } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/dropdown-components'
import {
  reset,
  toggleVisibility,
  $canSetThemePosition,
  testTasksFilters,
} from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import ClickOutside from '@/features/directives/click-outside.ts'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ThemesFilter',
  components: {
    Icon,
    ClassesDropdown: dropdownComponents.ClassesDropdown,
    SubjectsDropdown: dropdownComponents.SubjectsDropdown,
    DifficultyDropdown: dropdownComponents.DifficultyDropdown,
    ThemeDropdown: dropdownComponents.ThemeDropdown,
    StatusDropdown: dropdownComponents.StatusDropdown,
    TypeDropdown: dropdownComponents.TypeDropdown,
    LanguageDropdown: dropdownComponents.LanguageDropdown,
    BaseButton,
    LabelsDropdown: dropdownComponents.LabelsDropdown,
    BaseSwitch,
  },
  effector: {
    $filterParams: testTasksFilters.store.$filterParams,
    $canSetThemePosition,
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

.labels-input-relative-align {
  width: 100%;
  display: flex;
  align-self: flex-end;
  height: 46px;

  .switch {
    display: flex;
    align-items: center;
  }
  .buttons {
    display: flex;
    align-items: center;
    margin-left: 51px;

    .btn:first-child {
      margin-right: 38px;
    }
  }
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
