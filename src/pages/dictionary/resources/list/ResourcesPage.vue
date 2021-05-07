<template>
  <div id="resources-page">
    <PageHeader />
    <GeneralFilter
      :search-fields="searchFields"
      @setFilter="onFilterSet"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @resetFilter="onFilterReset"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <ResourcesFilter
          :visible="$visibility"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
          @changeFilter="changeFilter"
        />
      </template>
    </GeneralFilter>
    <LoaderBig v-if="$isLoading" />
    <ResourcesTree
      v-if="!$isLoading"
      @resetFilter="onFilterReset"
      @onRightClick="handleRightClick"
      @loadTree="val => loadTree(val)"
      @onRemove="onRemoveResource"
    />
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :selected="[]"
      :style="contextMenuStyles"
      :type="contextMenuType"
      :theme="theme"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="onRemoveResource"
    />
    <ConfirmDeleteModal
      type="resource"
      @confirmDelete="removeResource"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueEvents from 'vue-events'
import PageHeader from '@/pages/dictionary/resources/list/parts/PageHeader.vue'
import ContextMenu from '@/pages/dictionary/resources/list/parts/ContextMenu.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ResourcesFilter from '@/pages/dictionary/resources/list/parts/resources-filter/ResourcesFilter.vue'
import ResourcesTree from '@/pages/dictionary/resources/list/parts/tree/ResourcesTree.vue'
import {
  loadTree,
  loadTreeLight,
  $resourcesTreeTotal,
  deleteResources,
  $isLoading,
} from '@/pages/dictionary/resources/list/resources-page.model'
import {
  toggleVisibility,
  $visibility,
  resourcesFilters,
} from '@/pages/dictionary/resources/list/parts/resources-filter/resources-filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { searchFieldsData } from '@/pages/dictionary/resources/list/constants'
import { RefsType, RightClickParams } from '@/pages/common/types'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'

Vue.use(VueEvents)

export default (Vue as VueConstructor<
  Vue & {
    $refs: RefsType
  }
>).extend({
  name: 'ResourcesPage',
  components: {
    PageHeader,
    GeneralFilter,
    ResourcesFilter,
    ContextMenu,
    ResourcesTree,
    ConfirmDeleteModal,
    LoaderBig,
  },
  effector: {
    $visibility,
    $resourcesTreeTotal,
    $isLoading,
  },
  data() {
    return {
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_theme',
      contextMenuStyles: { top: '0', left: '0' },
      searchFields: searchFieldsData,
      total: 0,
      theme: null,
    }
  },
  computed: {
    selectedRows(): number[] {
      if (!this.$refs.vuetable) return []
      return this.$refs.vuetable.selectedTo
    },
  },
  methods: {
    changeFilter: resourcesFilters.methods.changeFilter,
    resetFilters: resourcesFilters.methods.resetFilters,
    applyFilters: resourcesFilters.methods.applyFilters,
    loadTree,
    toggleVisibility,
    onFilterSet() {
      this.applyFilters()
    },
    onFilterReset() {
      this.resetFilters()
      reset() // search string and field
    },
    onRemoveResource(ids: number[]) {
      loadConfirmDeleteModal(ids)
    },
    removeResource(ids: number[]) {
      deleteResources(ids)
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
      event.preventDefault()
      this.theme = data.theme
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.clickedRowId = data.id
      this.showContextMenu = true
      this.contextMenuType = type
      this.contextMenuStyles = { top: `${event.y + scrollTop}px`, left: `${event.x + 120}px` }
    },
    hideContextMenu() {
      this.showContextMenu = false
    },
  },
  mounted() {
    loadTreeLight()
  },
})
</script>

<style scoped>
.invisible {
  display: none;
}

.table-container {
  overflow-x: auto;
  background-color: #fff;
}

.table /deep/ tr:nth-child(2n) {
  background-color: var(--c-grey-7);
}

.table /deep/ .ui.table thead th {
  background-color: #fff;
}

.table /deep/ .ui.table {
  border-radius: 0px;
  border: none;
}

.table /deep/ .ui.table,
.table /deep/ .ui.table thead th,
.table /deep/ .ui.celled.table tr td,
.table /deep/ .ui.celled.table tr th {
  border-bottom: none;
  border-left: none;
  border-top: none;
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
}

.table /deep/ .vuetable-slot {
  overflow: initial !important;
}

.table /deep/ th[class^='vuetable-th'] {
  color: var(--base-text-primary);
  font-weight: 600;
}

.table /deep/ [type='checkbox'] {
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: #d0d7e0;
  border-radius: 7px;
  border: none;
  appearance: none;
}

.table /deep/ [type='checkbox']:checked {
  width: 24px;
  height: 24px;
  background: var(--base-text-primary);
  border-radius: 7px;
  border: none;
  appearance: none;
  position: relative;
  &::after {
    content: '\2143';
    color: #fff;
    text-align: center;
    position: absolute;
    left: 6px;
    bottom: 4px;
    font-size: 16px;
    transform: rotate(35deg);
    font-weight: bold;
  }
}

.vuetable-pagination {
  @mixin vuetable-pagination;
}
.reset-filters {
  color: var(--base-text-primary);
  cursor: pointer;
  @mixin underline-text;
}

.context-menu {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
