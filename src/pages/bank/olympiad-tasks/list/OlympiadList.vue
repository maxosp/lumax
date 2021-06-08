<template>
  <div id="tags-page">
    <PageHeader
      :table-columns="fields"
      :selected-rows="selectedRows"
      @onExport="downloadOlympiadAssignmentTableFile"
    />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
      @resetFilter="onFilterReset"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <TasksFilter
          :visible="$visibility"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
          @changeFilter="changeFilter"
        />
      </template>
    </GeneralFilter>
    <LoaderBig v-if="$isLoading" />
    <TableHeader
      v-if="!$isLoading"
      :total="total"
      :selected-rows="selectedRows"
      @onEdit="editTask"
      @onRemove="onRemoveTask"
      @onDuplicate="duplicateAssignment"
      @onDuplicateNTimes="loadDuplicateModal"
      @showPreview="showPreview"
      @onRemoveSelection="removeSelection"
    />

    <div :class="{ 'table-container': true, invisible: $isLoading, hideHeader: !total }">
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
        <template #tags_string="props">
          <TooltipCell
            :title="props.rowData.tags_string || '-'"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template #wording="props">
          <TooltipCell
            :title="clearWording(props.rowData.wording) || ''"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template #type="props">
          <TooltipCell
            :icon-type="getCorrectIconType(props.rowData.type)"
            :description="getCorrectDescriptionType(props.rowData.type)"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template id="one" #actions="props">
          <Actions
            :id="props.rowData.id"
            :selected="selectedRows"
            @onRemove="onRemoveTask"
            @onEdit="editTask"
            @showPreview="showPreview"
            @onDuplicate="duplicateAssignment"
            @onDuplicateNTimes="loadDuplicateModal"
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
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :key="clickedRowId"
      :selected="selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      :class-id="class_id"
      :subject-id="subject_id"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="onRemoveTask"
      @onEdit="editTask"
      @showPreview="showPreview"
      @onDuplicate="duplicateAssignment"
      @onDuplicateNTimes="loadDuplicateModal"
    />
    <TasksTypesModal />
    <TasksUpdateModal />
    <ConfirmDeleteModal
      type="task"
      @confirmDelete="removeSelectedTask"
    />
    <RequestDeleteModal
      @confirmRequestDelete="sendRequestDeleteTask"
    />
    <DuplicateModal
      @confirmTaskDuplicate="duplicateAssignment"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import { searchFieldsData, olympiadTasksDataFields } from '@/pages/bank/olympiad-tasks/constants'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import PageHeader from '@/pages/bank/olympiad-tasks/list/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import TasksFilter from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/TasksFilter.vue'
import TableHeader from '@/pages/bank/olympiad-tasks/list/parts/table/TableHeader.vue'
import TooltipCell from '@/pages/bank/olympiad-tasks/list/parts/table/TooltipCell.vue'
import Actions from '@/pages/bank/olympiad-tasks/list/parts/table/Actions.vue'
import ContextMenu from '@/pages/bank/olympiad-tasks/list/parts/ContextMenu.vue'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import {
  loadList,
  $canRefreshTableAfterDeletion,
  duplicateAssignment,
  $canRefreshAfterDuplicate,
  deleteAssignments,
  requestDeleteAssignments,
  olympiadTaskPageParams,
  $isLoading,
  downloadOlympiadAssignmentTableFile,
} from '@/pages/bank/olympiad-tasks/list/olympiad-tasks-page.model'
import {
  olympiadTasksFilters,
  toggleVisibility,
  $visibility,
} from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/tasks-filter.model'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { $canRefreshAfterMultiChanges } from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'
import { $session } from '@/features/session'
import { RefsType, RightClickParams } from '@/pages/common/types'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { navigatePush } from '@/features/navigation'
import TasksTypesModal from '@/pages/common/modals/tasks-bank/tasks-types/TasksTypesModal.vue'
import TasksUpdateModal from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/TasksUpdateModal.vue'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import RequestDeleteModal from '@/pages/common/modals/request-delete/RequestDeleteModal.vue'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { loadRequestDeleteModal } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import {
  combineRouteQueries,
  computeSortParam,
  isQueryParamsEquelToPage,
  removeHtmlTags,
} from '@/features/lib'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'
import { loadDuplicateModal } from '@/pages/bank/common/modals/duplicate/duplicate.model'
import DuplicateModal from '@/pages/bank/common/modals/duplicate/DuplicateModal.vue'

Vue.component('VuetableFieldCheckbox', VuetableFieldCheckbox)

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: RefsType
    }
  >
).extend({
  components: {
    NoDataContent,
    PageHeader,
    GeneralFilter,
    TasksFilter,
    TableHeader,
    TooltipCell,
    Actions,
    ContextMenu,
    Vuetable,
    VuetablePagination,
    TasksTypesModal,
    TasksUpdateModal,
    ConfirmDeleteModal,
    RequestDeleteModal,
    LoaderBig,
    DuplicateModal,
  },
  effector: {
    $visibility,
    $token,
    $canRefreshTableAfterDeletion,
    $session,
    $canRefreshAfterMultiChanges,
    $canRefreshAfterDuplicate,
    $filterParams: olympiadTasksFilters.store.$filterParams,
    $pageParams: olympiadTaskPageParams.store.$pageParams,
    $currentPage: olympiadTaskPageParams.store.currentPage,
    $isLoading,
  },
  data() {
    return {
      searchFields: searchFieldsData,
      total: 1,
      fields: olympiadTasksDataFields,
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
      return `${config.BACKEND_URL}/api/assignment-app/olympiad-assignment/list/`
    },
  },
  watch: {
    $canRefreshTable: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
      },
    },
    $canRefreshAfterDuplicate: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
        this.removeSelection()
      },
    },
    $canRefreshAfterMultiChanges: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
        this.removeSelection()
      },
    },
    $canRefreshTableAfterDeletion: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
        this.removeSelection()
      },
    },
    $pageParams: {
      handler(newVal) {
        if (!isQueryParamsEquelToPage(this.$route.query, newVal)) {
          this.$router.replace(combineRouteQueries(this.$route.query, newVal))
        }
      },
    },
  },
  methods: {
    changeFilter: olympiadTasksFilters.methods.changeFilter,
    resetFilters: olympiadTasksFilters.methods.resetFilters,
    applyFilters: olympiadTasksFilters.methods.applyFilters,
    changePage: olympiadTaskPageParams.methods.changePage,
    queryToParams: olympiadTaskPageParams.methods.queryToParams,
    toggleVisibility,
    loadList,
    reset,
    duplicateAssignment,
    loadDuplicateModal,
    downloadOlympiadAssignmentTableFile,
    clearWording(str: string) {
      return removeHtmlTags(str)
    },
    getCorrectIconType(type: string) {
      return mapTaskTypeTo[type].icon
    },
    getCorrectDescriptionType(type: string) {
      return mapTaskTypeTo[type].description
    },
    showPreview(idArr: number[]) {
      this.$router.push({
        name: 'preview-task',
        query: {
          questions: idArr.join(','),
          fromPage: 'tasks',
          taskType: 'olympiad-assignment',
          token: this.$token,
        },
      })
    },
    editTask(id: number) {
      navigatePush({
        name: 'olympiad-tasks-edit',
        query: {
          fromPage: 'tasks',
        },
        params: { id: `${id}` },
      })
    },
    onRemoveTask(ids: number[]) {
      this.$session?.permissions?.assignments_assignment?.delete
        ? loadConfirmDeleteModal(ids)
        : loadRequestDeleteModal(ids)
    },
    async removeSelectedTask(ids: number[]) {
      await deleteAssignments(ids)
      await Vue.nextTick(() => this.$refs.vuetable.reload())
      this.removeSelection()
    },
    async sendRequestDeleteTask(comment: string, ids: number[]) {
      await requestDeleteAssignments({ assignments: ids, ticket_comment: comment })
      this.removeSelection()
    },
    removeSelection() {
      this.$refs.vuetable.selectedTo = []
      this.selectedRows = []
    },
    async myFetch(apiUrl: string, httpOptions: any) {
      const request = axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
      return request
    },
    onFilterSet() {
      this.applyFilters()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.resetFilters()
      reset() // search string and field
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
      if (!res.response) {
        noInternetToastEvent()
      }
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
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
    loadList({})
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

.context-menu {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
