<template>
  <div id="lessons-page">
    <PageHeader :selected-rows="selectedRows" />
    <GeneralFilter
      :search-fields="searchFields"
      @setFilter="onFilterSet"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <LessonsFilter
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
      @onRemove="onRemoveTask"
      @onPreview="showPreview"
      @onEdit="editTask"
    />
    <div :class="{ 'table-container': true, invisible: $treeView || $isLoading }">
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
            @onPreview="showPreview"
            @onEdit="editTask"
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
    <div :class="{ invisible: !$treeView || $isLoading }">
      <LessonsTree
        @loadTree="val => loadTree(val)"
        @onRightClick="handleRightClick"
        @onRemove="onRemoveTask"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :selected="$treeView ? [] : selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="onRemoveTask"
      @onPreview="showPreview"
      @onEdit="editTask"
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
    <CreatingFolderModal />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueEvents from 'vue-events'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import PageHeader from '@/pages/bank/lesson-tasks/list/parts/PageHeader.vue'
import TableHeader from '@/pages/bank/lesson-tasks/list/parts/table/TableHeader.vue'
import TooltipCell from '@/pages/bank/olympiad-tasks/list/parts/table/TooltipCell.vue'
import Actions from '@/pages/bank/lesson-tasks/list/parts/table/Actions.vue'
import ContextMenu from '@/pages/bank/lesson-tasks/list/parts/table/ContextMenu.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import LessonsFilter from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/LessonsFilter.vue'
import LessonsTree from '@/pages/bank/lesson-tasks/list/parts/lessons-tree/LessonsTree.vue'
import {
  loadTree,
  $lessonsTreeTotal,
  deleteAssignments,
  requestDeleteAssignments,
  lessonTaskPageParams,
  loadTreeLight,
  $isLoading,
} from '@/pages/bank/lesson-tasks/list/lesson-page.model'
import {
  toggleVisibility,
  $visibility,
  lessonTasksFilters,
} from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/lesson-tasks-filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { lessonsTableFields, searchFieldsData } from '@/pages/bank/lesson-tasks/list/constants'
import { ContextMenuType } from '@/pages/bank/lesson-tasks/list/types'
import { mapTaskTypeTo } from '@/pages/common/constants'
import { RefsType } from '@/pages/common/types'
import { navigatePush } from '@/features/navigation'
import { $canRefreshAfterMultiChanges } from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/tasks-update-modal.model'
import TasksTypesModal from '@/pages/common/modals/tasks-bank/tasks-types/TasksTypesModal.vue'
import TasksUpdateModal from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/TasksUpdateModal.vue'
import RequestDeleteModal from '@/pages/common/modals/request-delete/RequestDeleteModal.vue'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { loadRequestDeleteModal } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { $session } from '@/features/session'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import CreatingFolderModal from '@/pages/common/modals/tasks-bank/creating-folder/CreatingFolderModal.vue'
import {
  combineRouteQueries,
  computeSortParam,
  cropString,
  isQueryParamsEquelToPage,
  removeHtmlTags,
} from '@/features/lib'
import { changeTasks } from '@/pages/preview-tasks/tasks-dropdown/tasks-dropdown.model'
import { LessonAssignment } from '@/features/api/assignment/types'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'

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
  name: 'LessonsTasksList',
  components: {
    Vuetable,
    VuetablePagination,
    PageHeader,
    TableHeader,
    GeneralFilter,
    LessonsFilter,
    TooltipCell,
    Actions,
    ContextMenu,
    LessonsTree,
    TasksTypesModal,
    TasksUpdateModal,
    NoDataContent,
    ConfirmDeleteModal,
    RequestDeleteModal,
    CreatingFolderModal,
    LoaderBig,
  },
  effector: {
    $token,
    $visibility,
    $lessonsTreeTotal,
    $canRefreshAfterMultiChanges,
    $session,
    $filterParams: lessonTasksFilters.store.$filterParams,
    $pageParams: lessonTaskPageParams.store.$pageParams,
    $treeView: lessonTaskPageParams.store.treeView,
    $currentPage: lessonTaskPageParams.store.currentPage,
    $isLoading,
  },
  data() {
    return {
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_lessons',
      contextMenuStyles: { top: '0', left: '0' },
      fields: lessonsTableFields,
      searchFields: searchFieldsData,
      total: 0,
      selectedRows: [] as number[] | null,
      localItems: [] as LessonAssignment[],
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/assignment/lesson-assignment/list/`
    },
  },
  watch: {
    $canRefreshAfterMultiChanges: {
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
    changeFilter: lessonTasksFilters.methods.changeFilter,
    resetFilters: lessonTasksFilters.methods.resetFilters,
    applyFilters: lessonTasksFilters.methods.applyFilters,
    toggleTreeView: lessonTaskPageParams.methods.toggleTreeView,
    changePage: lessonTaskPageParams.methods.changePage,
    queryToParams: lessonTaskPageParams.methods.queryToParams,
    toggleVisibility,
    loadTree,
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
          taskType: 'lesson-assignment',
          token: this.$token,
          fromPage: 'tasks',
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
    async myFetch(apiUrl: string, httpOptions: any) {
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
      this.removeSelection()
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
    editTask(id: number) {
      navigatePush({
        name: 'lesson-tasks-edit',
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
    handleLoadError(res: any) {
      if (!res.response) {
        noInternetToastEvent()
      }
    },
    handleRightClick({ data, event, type = 'table_lessons' }: RightClickParams) {
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
