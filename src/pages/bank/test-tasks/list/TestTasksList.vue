<template>
  <div id="tasks-page">
    <PageHeader :selected-rows="selectedRows" />
    <GeneralFilter
      :search-fields="searchFields"
      @setFilter="onFilterSet"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <ThemesFilter
          :visible="$visibility"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
          @changeFilter="changeFilter"
        />
      </template>
    </GeneralFilter>
    <TableHeader
      :total="$treeView ? $tasksTreeTotal : total"
      :selected-rows="selectedRows"
      @onEdit="handleEditTask"
      @showPreview="showPreview"
      @onRemove="onRemoveTask"
    />
    <div :class="{ 'table-container': true, invisible: $treeView }">
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
            @onRemove="onRemoveTask"
            @onCheck="sendToModerationAssignments"
            @onPublish="publishAssignments"
            @onPreview="showPreview"
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
      <TasksTree
        @onRightClick="handleRightClick"
        @onRemoveTask="onRemoveTask"
        @onRemoveTheme="onRemoveTheme"
        @onPreview="showPreview"
        @loadTree="val => loadTree(val)"
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
      @onRemove="onRemoveTask"
      @onCheck="sendToModerationAssignments"
      @onPublish="publishAssignments"
      @onRemoveTask="onRemoveTask"
      @onRemoveTheme="onRemoveTheme"
      @onPreview="showPreview"
      @onEdit="handleEditTask"
    />
    <TasksTypesModal />
    <TasksUpdateModal />
    <ConfirmDeleteModal
      :type="showDeleteModalType"
      @confirmDelete="handleConfirmDelete"
    />
    <RequestDeleteModal
      @confirmRequestDelete="sendRequestDeleteTask"
    />
    <ModeratorSelectModal type="test" />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueEvents from 'vue-events'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import PageHeader from '@/pages/bank/test-tasks/list/parts/PageHeader.vue'
import TableHeader from '@/pages/bank/test-tasks/list/parts/table/TableHeader.vue'
import TooltipCell from '@/pages/bank/olympiad-tasks/list/parts/table/TooltipCell.vue'
import Actions from '@/pages/bank/test-tasks/list/parts/table/Actions.vue'
import ContextMenu from '@/pages/bank/test-tasks/list/parts/table/ContextMenu.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ThemesFilter from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/ThemesFilter.vue'
import ModeratorSelectModal from '@/pages/bank/common/modals/moderator-select/ModeratorSelectModal.vue'
import TasksTree from '@/pages/bank/test-tasks/list/parts/tasks-tree/TasksTree.vue'
import {
  loadTree,
  loadTreeLight,
  $tasksTreeTotal,
  deleteAssignments,
  requestDeleteAssignments,
  sendAssignmentsPublish,
  testTaskPageParams,
} from '@/pages/bank/test-tasks/list/tasks-page.model'
import {
  toggleVisibility,
  $visibility,
  testTasksFilters,
} from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { themesTableFields, searchFieldsData } from '@/pages/bank/test-tasks/list/constants'
import { ContextMenuType } from '@/pages/bank/test-tasks/list/types'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { loadRequestDeleteModal } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { $session } from '@/features/session'
import { deleteThemes } from '@/pages/dictionary/themes/list/themes-page.model'
import { RefsType, HttpOptionsType } from '@/pages/common/types'
import { navigatePush } from '@/features/navigation'
import TasksTypesModal from '@/pages/common/modals/tasks-bank/tasks-types/TasksTypesModal.vue'
import TasksUpdateModal from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/TasksUpdateModal.vue'
import RequestDeleteModal from '@/pages/common/modals/request-delete/RequestDeleteModal.vue'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import { changeTasks } from '@/pages/preview-tasks/tasks-dropdown/tasks-dropdown.model'
import { $canRefreshAfterMultiChanges } from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'
import {
  $canRefreshAfterSendingForModeration,
  loadModalToSendForCheck,
} from '@/pages/bank/common/modals/moderator-select/moderator-select.model'
import { TestAssignment } from '@/features/api/assignment/types'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import {
  combineRouteQueries,
  computeSortParam,
  cropString,
  isQueryParamsEquelToPage,
  removeHtmlTags,
} from '@/features/lib'

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
    NoDataContent,
    TasksTypesModal,
    TasksUpdateModal,
    ConfirmDeleteModal,
    RequestDeleteModal,
    ModeratorSelectModal,
  },
  effector: {
    $token,
    $visibility,
    $tasksTreeTotal,
    $session,
    $filterParams: testTasksFilters.store.$filterParams,
    $canRefreshAfterMultiChanges,
    $canRefreshAfterSendingForModeration,
    $pageParams: testTaskPageParams.store.$pageParams,
    $treeView: testTaskPageParams.store.treeView,
    $currentPage: testTaskPageParams.store.currentPage,
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
      selectedRows: [] as number[] | null,
      isTheme: false,
      subject: null,
      studyYear: null,
      theme: null,
      localItems: [] as TestAssignment[],
      showDeleteModalType: 'task',
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/assignment/test-assignment/list/`
    },
  },
  watch: {
    $canRefreshAfterMultiChanges: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.reload()
      },
    },
    $canRefreshAfterSendingForModeration: {
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
  },
  methods: {
    changeFilter: testTasksFilters.methods.changeFilter,
    resetFilters: testTasksFilters.methods.resetFilters,
    applyFilters: testTasksFilters.methods.applyFilters,
    toggleTreeView: testTaskPageParams.methods.toggleTreeView,
    changePage: testTaskPageParams.methods.changePage,
    queryToParams: testTaskPageParams.methods.queryToParams,
    loadTree,
    toggleVisibility,
    showPreview(idArr: number[]) {
      if (idArr.length > 1) {
        const filteredList = this.localItems
          .filter((item) => idArr.filter((itemArr) => itemArr === item.id).length > 0)
          .map((item) => ({
            id: item.id,
            name: `${item.id}`,
            title: `[id${item.id}] - ${cropString(item.wording, 34)}`,
          }))
        changeTasks(filteredList)
      }
      this.$router.push({
        name: 'preview-task',
        query: {
          questions: idArr.join(','),
          type: 'test-assignment',
          token: this.$token,
        },
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
    async myFetch(apiUrl: string, httpOptions: HttpOptionsType) {
      /* todo: don't save localItems and use them in showPreview like that, fetch that data directly on the PreviewPage  */
      const request = axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
      const {
        data: { data },
      } = await request
      this.localItems = data
      return request
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage(page: any) {
      this.$refs.vuetable.changePage(page)
      this.changePage(page)
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
    onRemoveTask(ids: number[]) {
      this.showDeleteModalType = 'task'
      this.$session?.permissions?.assignments_assignment?.delete
        ? loadConfirmDeleteModal(ids)
        : loadRequestDeleteModal(ids)
    },
    handleConfirmDelete(ids: number[], type: string) {
      if (type === 'task') {
        this.removeSelectedTask(ids)
      }
      if (type === 'theme') {
        this.removeSelectedTheme(ids)
      }
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
    onRemoveTheme(ids: number[]) {
      this.showDeleteModalType = 'theme'
      this.$session?.permissions?.subjects_theme?.delete
        ? loadConfirmDeleteModal(ids)
        : loadRequestDeleteModal(ids)
    },
    async removeSelectedTheme(ids: number[]) {
      await deleteThemes(ids)
    },
    handleEditTask(id: number) {
      navigatePush({ name: 'test-tasks-edit', params: { id: `${id}` } })
    },
    async publishAssignments(ids: number | number[]) {
      await sendAssignmentsPublish({ assignments: typeof ids === 'number' ? [ids] : ids })
      await Vue.nextTick(() => this.$refs.vuetable.reload())
    },
    sendToModerationAssignments(ids: number | number[]) {
      const data = typeof ids === 'number' ? [ids] : ids
      loadModalToSendForCheck(data)
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
    loadTreeLight()
  },
  created() {
    // Authorization request
    axios.interceptors.request.use((request) => {
      request.headers.Authorization = `Bearer ${this.$token}`
      return request
    })
    this.queryToParams(this.$route.query)
  },
  beforeDestroy() {
    this.onFilterReset()
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
