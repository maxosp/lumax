<template>
  <div id="tags-page">
    <PageHeader :table-columns="fields" />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
      @resetFilter="onFilterReset"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <TagsFilter
          :visible="$visibility"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
          @changeFilter="changeFilter"
        />
      </template>
    </GeneralFilter>
    <TableHeader
      v-if="!$isLoading"
      :total="$treeView ? $tagsTreeTotal : total"
      :selected-rows="selectedRows"
      @onEdit="editTag"
      @onRemove="onRemoveTags"
      @showTasks="showTasks"
      @onRemoveSelection="removeSelection"
    />
    <LoaderBig v-if="$isLoading" />
    <div :class="{ 'table-container': true, invisible: $treeView || $isLoading, hideHeader: !total }">
      <Vuetable
        ref="vuetable"
        class="table"
        :api-mode="true"
        :api-url="apiUrl"
        :fields="fields"
        :http-fetch="myFetch"
        :append-params="$filterParams"
        :initial-page="$currentPage"
        pagination-path=""
        :per-page="25"
        @vuetable:load-error="handleLoadError"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:cell-rightclicked="handleRightClick"
        @vuetable:row-clicked="handleRowClick"
        @vuetable:checkbox-toggled-all="allToggled"
      >
        <template #name="props">
          <TooltipCell
            :title="props.rowData.name"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template #assignments_ids="props">
          <TooltipCell
            :title="props.rowData.assignments_ids && props.rowData.assignments_ids.join(', ') || ''"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template id="one" #actions="props">
          <Actions
            :id="props.rowData.id"
            :selected="selectedRows"
            @onRemove="onRemoveTags"
            @onEdit="editTag"
            @showTasks="showTasks"
            @createTag="(val) => createTagFromTree(val)"
          />
        </template>
      </Vuetable>
      <NoDataContent
        v-if="!total"
        @resetFilters="onFilterReset"
      />
      <div class="vuetable-pagination ui basic segment grid">
        <VuetablePagination
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
      </div>
    </div>
    <div :class="{ invisible: !$treeView }">
      <TagsTree
        v-if="!$isLoading"
        :filters="$filterParams"
        @onRightClick="handleRightClick"
        @loadTree="val => loadTree(val)"
        @onRemove="onRemoveTags"
        @resetFilters="onFilterReset"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :key="clickedRowId"
      :selected="$treeView ? [] : selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      :class-id="class_id"
      :subject-id="subject_id"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="onRemoveTags"
      @onEdit="editTag"
      @showTasks="showTasks"
      @createTag="(val) => createTagFromTree(val)"
    />
    <TagCreationModal />
    <TagEditionModal />
    <TasksModal @showPreview="showPreview" />
    <ConfirmDeleteModal
      type="tag"
      @confirmDelete="removeSelectedTags"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import { searchFieldsData, tagsDataFields } from '@/pages/tags/constants'
import {
  toggleVisibility,
  $visibility,
  tagsFilters,
} from '@/pages/tags/parts/tags-filter/tags-filter.model'
import {
  loadTreeLight,
  loadTree,
  $tagsTreeTotal,
  deleteTags,
  tagsPageParams,
  $isLoading,
  collectTaskData,
} from '@/pages/tags/tags-page.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import PageHeader from '@/pages/tags/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import TagsFilter from '@/pages/tags/parts/tags-filter/TagsFilter.vue'
import TableHeader from '@/pages/tags/parts/table/TableHeader.vue'
import TooltipCell from '@/pages/tags/parts/table/TooltipCell.vue'
import Actions from '@/pages/tags/parts/table/Actions.vue'
import TagsTree from '@/pages/tags/parts/tree/TagsTree.vue'
import ContextMenu from '@/pages/tags/parts/ContextMenu.vue'
import TagCreationModal from '@/pages/tags/parts/modals/tag-creation/TagCreationModal.vue'
import TagEditionModal from '@/pages/tags/parts/modals/tag-edition/TagEditionModal.vue'
import TasksModal from '@/pages/tags/parts/modals/tasks/TasksModal.vue'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { loadModal } from '@/pages/tags/parts/modals/tasks/tasks.model'
import {
  loadModalToEdit,
  $canRefreshTable,
} from '@/pages/tags/parts/modals/tag-edition/tag-edition.modal'
import {
  $canRefreshTableAfterCreation,
  createTagFromTree,
} from '@/pages/tags/parts/modals/tag-creation/tag-creation.modal'
import { RefsType, HttpOptionsType, RightClickParams } from '@/pages/common/types'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { combineRouteQueries, computeSortParam, isQueryParamsEquelToPage } from '@/features/lib'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'
import { navigatePush } from '@/features/navigation'
import { changeTasks } from '@/pages/preview-tasks/parts/tasks-dropdown/tasks-dropdown.model'

Vue.component('VuetableFieldCheckbox', VuetableFieldCheckbox)

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: RefsType
    }
  >
).extend({
  components: {
    PageHeader,
    GeneralFilter,
    TagsFilter,
    TableHeader,
    TooltipCell,
    Actions,
    TagsTree,
    ContextMenu,
    TagCreationModal,
    TagEditionModal,
    TasksModal,
    Vuetable,
    VuetablePagination,
    ConfirmDeleteModal,
    NoDataContent,
    LoaderBig,
  },
  effector: {
    $isLoading,
    $visibility,
    $tagsTreeTotal,
    $token,
    $canRefreshTable,
    $canRefreshTableAfterCreation,
    $filterParams: tagsFilters.store.$filterParams,
    $pageParams: tagsPageParams.store.$pageParams,
    $treeView: tagsPageParams.store.treeView,
    $currentPage: tagsPageParams.store.currentPage,
  },
  data() {
    return {
      searchFields: searchFieldsData,
      total: 0,
      fields: tagsDataFields,
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_theme',
      contextMenuStyles: { top: '0', left: '0' },
      selectedRows: [] as number[] | null,
      subject_id: null,
      class_id: null,
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/assignment-app/olympiad-tags/list/`
    },
  },
  watch: {
    $canRefreshTable: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
      },
    },
    $canRefreshTableAfterCreation: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
      },
    },
    $pageParams: {
      handler(newVal) {
        if (!isQueryParamsEquelToPage(this.$route.query, newVal)) {
          this.$router.replace(combineRouteQueries(this.$route.query, newVal))
        }
      },
    },
    $treeView: {
      handler(newVal) {
        if (newVal) this.removeSelection()
      },
    },
  },
  methods: {
    changeFilter: tagsFilters.methods.changeFilter,
    resetFilters: tagsFilters.methods.resetFilters,
    applyFilters: tagsFilters.methods.applyFilters,
    changePage: tagsPageParams.methods.changePage,
    queryToParams: tagsPageParams.methods.queryToParams,
    loadTree,
    toggleVisibility,
    reset,
    loadModalToEdit,
    createTagFromTree,
    showTasks(id: number) {
      loadModal(id)
    },
    editTag(id: number) {
      loadModalToEdit(id)
    },
    myFetch(apiUrl: string, httpOptions: HttpOptionsType) {
      return axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
    },
    onFilterSet() {
      this.applyFilters()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      reset() // search string and field
      this.resetFilters()
      Vue.nextTick(() => this.$refs.vuetable.reload())
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
      this.$refs.pagination.setPaginationData(paginationData)
      this.removeSelection()
    },
    onChangePage(page: any) {
      this.$refs.vuetable.changePage(page)
      this.changePage(page)
    },
    handleLoadError(res: any) {
      if (!res.response) noInternetToastEvent()
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
      if (this.$treeView) {
        this.subject_id = data.subject_id
        this.class_id = data.id
      }
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.clickedRowId = data.id
      this.showContextMenu = true
      this.contextMenuType = type
      this.contextMenuStyles = { top: `${event.y + scrollTop}px`, left: `${event.x + 120}px` }
      event.preventDefault()
    },
    handleRowClick(res: any) {
      if (res.event.target.closest('.actions-activator')) return
      const { selectedTo } = this.$refs.vuetable
      if (selectedTo.length === 0) selectedTo.push(res.data.id)
      else if (selectedTo.find((el: number) => el === res.data.id)) {
        selectedTo.splice(selectedTo.indexOf(res.data.id), 1)
      } else selectedTo.push(res.data.id)
      this.selectedRows = this.$refs.vuetable.selectedTo
    },
    allToggled(isSelected: boolean) {
      if (isSelected) this.selectedRows = this.$refs.vuetable.selectedTo
      else this.selectedRows = []
    },
    onRemoveTags(ids: number[]) {
      loadConfirmDeleteModal(ids)
    },
    async removeSelectedTags(ids: number[]) {
      await deleteTags(ids)
      await Vue.nextTick(() => this.$refs.vuetable.reload())
      this.removeSelection()
    },
    removeSelection() {
      this.$refs.vuetable.selectedTo = []
      this.selectedRows = []
    },
    showPreview(ids: number[]) {
      this.transferSelectedApps(ids)
      navigatePush({
        name: 'preview-task',
        query: {
          questions: ids.join(','),
          taskType: 'olympiad-assignment',
          token: this.$token,
          fromPage: 'tags',
        },
      })
    },
    transferSelectedApps(ids: number[]) {
      collectTaskData(ids).then((value) => changeTasks(value))
    },
    hideContextMenu() {
      this.showContextMenu = false
    },
  },
  created() {
    // Authorization request
    axios.interceptors.request.use((request) => {
      request.headers.Authorization = `Bearer ${this.$token}`
      return request
    })
    this.queryToParams(this.$route.query)
  },
  mounted() {
    loadTreeLight()
  },
  destroyed() {
    this.resetFilters()
  },
})
</script>

<style scoped>
.invisible {
  display: none;
}
.hideHeader ::v-deep .ui.table {
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
