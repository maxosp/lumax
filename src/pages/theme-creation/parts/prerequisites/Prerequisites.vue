<template>
  <div class="prerequisites-block">
    <FilterDropdown
      label="Пререквизиты темы"
      placeholder="Выберите пререквизиты"
      :methods="prerequisiteModuleMethods"
      :data="$prerequisites"
      :store="{ $item, $itemsDropdown, $searchString }"
      :selected-data="$selectedPrerequisites"
      :disabled="!$canSetPrerequisites"
    />
    <div class="selected-prerequisite">
      <div
        v-for="(item, index) in $selectedPrerequisites"
        :key="index"
        class="element"
        @contextmenu.prevent="showPrerequisiteMenu(item.id)"
      >
        <p> {{ item.title }} </p>
        <div
          class="icon-wrapper"
          @click="deletePrerequisite(item.name)"
        >
          <Icon
            type="close"
            size="10"
            class="icon"
          />
        </div>
        <PrerequisiteMenu
          :ref="`menu-${item.id}`"
          :prerequisite-id="item.id"
          class="menu"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import Icon from '@/ui/icon/Icon.vue'
import PrerequisiteMenu from '@/pages/theme-creation/parts/prerequisites/PrerequisiteMenu.vue'
import {
  $prerequisites,
  $selectedPrerequisites,
  prerequisiteDropdownModule,
  deletePrerequisite,
} from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'
import { $canSetPrerequisites } from '@/pages/theme-creation/theme-creation-page.model'

export default Vue.extend({
  components: {
    FilterDropdown,
    Icon,
    PrerequisiteMenu,
  },
  effector: {
    $prerequisites,
    $canSetPrerequisites,
    $selectedPrerequisites,
    ...prerequisiteDropdownModule.store,
  },
  data() {
    return {
      prerequisiteModuleMethods: prerequisiteDropdownModule.methods,
    }
  },
  methods: {
    deletePrerequisite,
    showPrerequisiteMenu(itemId: number) {
      let currentComponent = ''
      Object.keys(this.$refs).forEach((el) => {
        if (!el.includes(`menu-${itemId}`) && (this.$refs[el] as any)[0].opened)
          (this.$refs[el] as any)[0].$refs.tooltip.hideTooltip()
        if (el.includes(`menu-${itemId}`)) currentComponent = el
      })
      ;(this.$refs[currentComponent] as any)[0].$refs.tooltip.toggleTooltip()
    },
  },
})
</script>

<style scoped>
.prerequisites-block {
  .selected-prerequisite {
    @mixin flex-row-central;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: -10px;
    flex-wrap: wrap;
    .element {
      width: fit-content;
      height: 30px;
      padding: 0 10px;
      @mixin flex-row-central;
      background-color: var(--c-grey-8);
      border-radius: 6px;
      position: relative;
      p {
        font-weight: 300;
        line-height: 16px;
      }
      .icon-wrapper {
        width: 24px;
        height: 24px;
        @mixin flex-center;
        margin-left: 10px;
      }
      .icon {
        &:hover {
          cursor: pointer;
        }
      }
      .menu {
        position: absolute;
        right: 0;
      }
    }
    .element {
      margin-bottom: 10px;
    }
  }
}
</style>
