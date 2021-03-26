<template>
  <div id="tasks-page">
    <PageHeader :selected-rows="selectedRows" />
    <GeneralFilter
      :search-fields="searchFields"
      @setFilter="onFilterSet"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
    >
      <template #filter>
        <ThemesFilter
          :visible="$visibility"
          :filter-params="filterParams"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
        />
      </template>
    </GeneralFilter>
    <TableHeader
      :total="$treeView ? $tasksTreeTotal : total"
      :selected-rows="selectedRows"
      @onEdit="handleEditTask"
      @showPreview="showPreview"
    />
    <div :class="{ 'table-container': true, invisible: $treeView }">
      <Vuetable
        ref="vuetable"
        class="table"
        :api-mode="true"
        :api-url="apiUrl"
        :fields="fields"
        :http-fetch="myFetch"
        :append-params="filterParams"
        pagination-path=""
        @vuetable:load-error="handleLoadError"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:cell-rightclicked="handleRightClick"
        @vuetable:row-clicked="handleRowClick"
      >
        <template #assignments_ids="props">
          <TooltipCell
            :title="props.rowData.assignments_ids && props.rowData.assignments_ids.join(', ') || ''"
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
            :row-id="props.rowData.id"
            :description="getCorrectDescriptionType(props.rowData.type)"
            @onRightClick="handleRightClick"
          />
        </template>
        <template id="one" #actions="props">
          <Actions
            :id="props.rowData.id"
            :selected="selectedRows"
            :subject="subject"
            :study-year="studyYear"
            @onRemove="removeSelected"
            @onCheck="sendToModerationAssignments"
            @onPublish="publishAssignments"
            @onPreview="showPreview"
          />
        </template>
      </Vuetable>
      <div v-if="!total" class="no-data-content">
        <div>Поиск не дал результатов.</div>
        <div>Попробуйте
          <span class="reset-filters" @click="resetAllFilters">
            сбросить все фильтры
          </span>
        </div>
      </div>
      <div class="vuetable-pagination ui basic segment grid">
        <VuetablePagination
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
      </div>
    </div>
    <div :class="{ invisible: !$treeView }">
      <TasksTree
        @onRightClick="handleRightClick"
        @onRemoveTask="removeSelectedTask"
        @onRemoveTheme="removeSelectedTheme"
        @onPreview="showPreview"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :key="clickedRowId"
      :selected="$treeView ? [] : selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      :light="$treeView"
      :is-theme="isTheme"
      :subject="subject"
      :study-year="studyYear"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="removeSelected"
      @onCheck="sendToModerationAssignments"
      @onPublish="publishAssignments"
      @onRemoveTask="removeSelectedTask"
      @onRemoveTheme="removeSelectedTheme"
      @onPreview="showPreview"
      @onEdit="handleEditTask"
    />
    <TasksTypesModal />
    <TaskDeleteModal />
    <TasksUpdateModal />
    <DeletionRequsetModal />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueEvents from 'vue-events'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { computeSortParam, removeHtmlTags } from '@/pages/dictionary/themes/list/utils'
import PageHeader from '@/pages/bank/test-tasks/list/parts/PageHeader.vue'
import TableHeader from '@/pages/bank/test-tasks/list/parts/table/TableHeader.vue'
import TooltipCell from '@/pages/bank/olympiad-tasks/list/parts/table/TooltipCell.vue'
import Actions from '@/pages/bank/test-tasks/list/parts/table/Actions.vue'
import ContextMenu from '@/pages/bank/test-tasks/list/parts/table/ContextMenu.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ThemesFilter from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/ThemesFilter.vue'
import * as modals from '@/pages/bank/test-tasks/'
import TasksTree from '@/pages/bank/test-tasks/list/parts/tasks-tree/TasksTree.vue'
import {
  $treeView,
  loadTree,
  $tasksTreeTotal,
  deleteAssignment,
  deleteManyAssignments,
  sendAssignmentsPublish,
  sendAssignmentsToModeration,
} from '@/pages/bank/test-tasks/list/tasks-page.model'
import {
  toggleVisibility,
  $visibility,
} from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { themesTableFields, searchFieldsData } from '@/pages/bank/test-tasks/list/constants'
import { ContextMenuType } from '@/pages/bank/test-tasks/list/types'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { loadModalToDelete } from '@/pages/common/modals/tasks-bank/task-delete/task-delete-modal.model'
import { loadModalToRequestDeletion } from '@/pages/common/modals/tasks-bank/deletion-request/deletion-request-modal.model'
import { $session } from '@/features/session'
import { deleteTheme } from '@/pages/dictionary/themes/list/themes-page.model'
import { RefsType } from '@/pages/common/types'
import { navigatePush } from '@/features/navigation'

Vue.use(VueEvents)
Vue.component('VuetableFieldCheckbox', VuetableFieldCheckbox)

type RightClickParams = {
  data: any
  event: any
  type?: ContextMenuType
}

export default (Vue as VueConstructor<
  Vue & {
    $refs: RefsType
  }
>).extend({
  name: 'TestTasksList',
  components: {
    Vuetable,
    VuetablePagination,
    PageHeader,
    TableHeader,
    GeneralFilter,
    ThemesFilter,
    TooltipCell,
    Actions,
    ContextMenu,
    TasksTree,
    TasksTypesModal: modals.TasksTypesModal,
    TaskDeleteModal: modals.TaskDeletionModal,
    TasksUpdateModal: modals.TasksUpdateModal,
    DeletionRequsetModal: modals.DeletionRequestModal,
  },
  effector: {
    $token,
    $visibility,
    $treeView,
    $tasksTreeTotal,
    $session,
  },
  data() {
    return {
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_tasks',
      contextMenuStyles: { top: '0', left: '0' },
      fields: themesTableFields,
      searchFields: searchFieldsData,
      total: 0,
      filterParams: {},
      selectedRows: [] as number[] | null,
      isTheme: false,
      subject: null,
      studyYear: null,
      theme: null,
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/assignment/test-assignment/list/`
    },
  },
  methods: {
    toggleVisibility,
    showPreview(id: number) {
      this.$router.push({
        name: 'preview-task',
        query: { questionId: `${id}`, type: 'test-assignment', token: this.$token },
      })
    },
    clearWording(str: string) {
      return removeHtmlTags(str)
    },
    getCorrectIconType(type: string) {
      return mapTaskTypeTo[type].icon
    },
    getCorrectDescriptionType(type: string) {
      return mapTaskTypeTo[type].description
    },
    myFetch(apiUrl: string, httpOptions: any) {
      return axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage(page: any) {
      this.$refs.vuetable.changePage(page)
    },
    resetAllFilters() {
      this.filterParams = {}
      reset() // search string and field

      const resetEvent = new Event('reset-themes-filter')
      const container = document.querySelector('#tasks-page')
      container && container.dispatchEvent(resetEvent)

      // reload data
      loadTree({})
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterSet(newFilter: any) {
      this.filterParams = newFilter
      loadTree({ ...this.filterParams })
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.filterParams = {}
      reset() // search string and field

      // reload data
      loadTree({})
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    removeSelectedTask(ids: number[]) {
      this.$session?.permissions?.assignments_assignment?.delete
        ? loadModalToDelete(ids)
        : loadModalToRequestDeletion(ids)
    },
    async removeSelectedTheme(ids: number[]) {
      await deleteTheme(ids[0])
    },
    async removeSelected(ids: number | number[]) {
      if (typeof ids === 'number') await deleteAssignment(ids)
      else await deleteManyAssignments(ids)
      await Vue.nextTick(() => this.$refs.vuetable.refresh())
      if (typeof ids !== 'number') this.$refs.vuetable.selectedTo = []
    },
    handleEditTask(id: number) {
      navigatePush({ name: 'test-tasks-edit', params: { id: `${id}` } })
    },
    async publishAssignments(ids: number | number[]) {
      await sendAssignmentsPublish({ assignments: typeof ids === 'number' ? [ids] : ids })
      await Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    async sendToModerationAssignments(ids: number | number[]) {
      const data = typeof ids === 'number' ? [ids] : ids
      await sendAssignmentsToModeration({ assignments: data })
      await Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    handleLoadError(res: any) {
      if (!res.response) {
        noInternetToastEvent()
      }
    },
    handleRightClick({ data, event, type = 'table_tasks' }: RightClickParams) {
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.clickedRowId = data.id
      this.isTheme = data.isTheme
      this.subject = data.subject
      this.studyYear = data.studyYear
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
    hideContextMenu() {
      this.showContextMenu = false
    },
  },
  mounted() {
    this.$events.$on('filter-set', (data: any) => this.onFilterSet(data))
    this.$events.$on('filter-reset', () => this.onFilterReset())
    loadTree({})
  },
  created() {
    // Authorization request
    axios.interceptors.request.use((request) => {
      request.headers.Authorization = `Bearer ${this.$token}`
      return request
    })
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

.table /deep/ .vuetable-empty-result {
  display: none;
}

.no-data-content {
  width: 100%;
  min-height: 550px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--base-text-secondary);
  & > div + div {
    margin-top: 10px;
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
