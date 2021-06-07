<template>
  <div class="prerequisites-block">
    <FilterDropdown
      label="Пререквизиты темы"
      placeholder="Выберите пререквизиты"
      :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
      :data="$items"
      :store="{ $item, $itemsDropdown, $searchString }"
      :selected-data="$selectedPrerequisites"
      :loading="$loading"
      @infiniteHandler="nextPageTrigger"
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
          :prerequisite-id="+item.name"
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
import PrerequisiteMenu from '@/pages/dictionary/themes/create/parts/prerequisites/PrerequisiteMenu.vue'
import {
  $selectedPrerequisites,
  prerequisitesDropdownModel,
  deletePrerequisite,
} from '@/pages/dictionary/themes/create/parts/prerequisites/prerequisites.model'

export default Vue.extend({
  components: {
    FilterDropdown,
    Icon,
    PrerequisiteMenu,
  },
  effector: {
    $selectedPrerequisites,
    ...prerequisitesDropdownModel.store,
  },
  methods: {
    deletePrerequisite,
    ...prerequisitesDropdownModel.methods,
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
  beforeDestroy() {
    this.dropdownDestroy()
  },
})
</script>

<style scoped>
.prerequisites-block {
  .selected-prerequisite {
    @mixin flex-row-central;
    justify-content: flex-start;
    margin-top: 10px;
    margin-bottom: -10px;
    flex-wrap: wrap;
    .element {
      width: fit-content;
      min-height: 30px;
      padding: 7px 10px;
      @mixin flex-row-central;
      background-color: var(--c-grey-8);
      border-radius: 6px;
      position: relative;
      margin-bottom: 10px;
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
    .element:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
