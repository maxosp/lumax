<template>
  <div class="tags-wrapper">
    <FilterDropdown
      label="Тег"
      placeholder="Выберите тег"
      :data="$tags"
      :methods="{ setItems, resetItem, itemChanged, searchStringChanged, resetSearchString }"
      :store="{ $item, $itemsDropdown, $searchString }"
      :disabled="!$canSetTags"
      @item-changed="onSelectItem"
    />
    <div class="selected-tags">
      <div
        v-for="(item, index) in $selectedTags"
        :key="index"
        class="element"
      >
        <p> {{ item.title }} </p>
        <div
          class="icon-wrapper"
          @click="deleteTag(item.name)"
        >
          <Icon
            type="close"
            size="10"
            class="icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import Icon from '@/ui/icon/Icon.vue'
import {
  tagsDropdownModule,
  loadTags,
  $tags,
  $selectedTags,
  deleteTag,
} from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/tags-dropdown/tags-dropdown.model'
import { $canSetTags } from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/tasks-filter.model'
import { DropdownItem } from '@/pages/common/types'

export default Vue.extend({
  components: {
    FilterDropdown,
    Icon,
  },
  effector: {
    $tags,
    $canSetTags,
    $selectedTags,
    ...tagsDropdownModule.store,
  },
  methods: {
    ...tagsDropdownModule.methods,
    loadTags,
    deleteTag,
    onSelectItem(item: DropdownItem | null) {
      this.$emit('setItem', item ? item.name : null)
    },
  },
  mounted() {
    loadTags()
  },
})
</script>


<style scoped>
.selected-tags {
  @mixin flex-row-central;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: -10px;
  flex-wrap: wrap;
  .element {
    width: fit-content;
    min-height: 30px;
    padding: 7px 10px;
    box-sizing: border-box;
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
      fill: var(--c-grey-3);
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
</style>
