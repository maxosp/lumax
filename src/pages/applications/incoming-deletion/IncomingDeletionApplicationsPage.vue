<template>
  <div id="applications-page">
    <PageHeader :table-columns-names="fields" :selected-rows="selectedApplications" />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
    >
      <template #filter>
        <ApplicationsFilter
          :visible="$visibility"
          :filter-params="filterParams"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
        />
      </template>
    </GeneralFilter>
    <TableHeader
      :total="total"
      :selected-applications="selectedApplications"
      :show-actions="showTableHeaderActions"
      @onAccept="acceptApplications"
      @onReject="loadRejectApplications"
      @onOpen="openApplications"
      @onSeeComment="showComment"
    />

    <div :class="{ 'table-container': true, hideHeader: !total }">
      <Vuetable
        ref="vuetable"
        class="table"
        :api-mode="true"
        :api-url="apiUrl"
        :fields="fields"
        :http-fetch="myFetch"
        :append-params="filterParams"
        pagination-path=""
        :per-page="25"
        @vuetable:load-error="handleLoadError"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:cell-rightclicked="handleRightClick"
        @vuetable:row-clicked="handleRowClick"
      >
        <template #object_name="props">
          <TooltipCell
            :title="props.rowData.object_name || ''"
            :row-id="props.rowData.id"
            :row-task-id="props.rowData[props.rowData.object_type].id"
            :type="props.rowData.object_type"
            @onRightClick="handleRightClick"
          />
        </template>
        <template #comment="props">
          <TooltipCell
            :title="props.rowData.comment || '-'"
            :row-id="props.rowData.id"
            :row-task-id="props.rowData[props.rowData.object_type].id"
            :type="props.rowData.object_type"
            @onRightClick="handleRightClick"
          />
        </template>
        <template id="one" #actions="props">
          <Actions
            :selected-applications="[{ application: props.rowData.id, task: props.rowData[props.rowData.object_type].id, type: props.rowData.object_type }]"
            @onAccept="acceptApplications"
            @onReject="loadRejectApplications"
            @onOpen="openApplications"
            @onSeeComment="showComment"
          />
        </template>
      </Vuetable>
      <div v-if="!total" class="no-data-content">
        Заявки не найдены
      </div>
      <div class="vuetable-pagination ui basic segment grid">
        <VuetablePagination
          ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        />
      </div>
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :key="selectedApplications[0].application"
      :selected-applications="selectedApplications"
      :style="contextMenuStyles"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onAccept="acceptApplications"
      @onReject="loadRejectApplications"
      @onOpen="openApplications"
      @onSeeComment="showComment"
    />
    <RejectModal @reject="val => rejectApplications({ tickets: val })" />
    <RejectedModal />
    <CommentModal />
    <DeleteModal @delete="val => checkIfElementCanBeDeleted(val)" />
    <CannotDeleteModal
      :value="currentFailed"
      :show-modal="showDeleteModal"
      @toggle-modal="val => toggleModal(val)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { computeSortParam } from '@/pages/dictionary/themes/list/utils'
import { RightClickParams } from '@/pages/bank/olympiad-tasks/types'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import {
  searchFieldsData,
  incomingDeletionApplicationsDataFields,
} from '@/pages/applications/incoming-deletion/constants'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import PageHeader from '@/pages/applications/incoming-deletion/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ApplicationsFilter from '@/pages/applications/incoming-deletion/parts/filter/Filter.vue'
import TableHeader from '@/pages/applications/incoming-deletion/parts/table/TableHeader.vue'
import TooltipCell from '@/pages/applications/incoming-deletion/parts/table/TooltipCell.vue'
import Actions from '@/pages/applications/incoming-deletion/parts/table/Actions.vue'
import ContextMenu from '@/pages/applications/incoming-deletion/parts/ContextMenu.vue'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import {
  loadList,
  rejectApplications,
  $canRefreshTable,
} from '@/pages/applications/incoming-deletion/incoming-deletion-applications-page.model'
import {
  toggleVisibility,
  $visibility,
} from '@/pages/applications/incoming-deletion/parts/filter/filter.model'
import { $session } from '@/features/session'
import RejectModal from '@/pages/applications/modals/reject/RejectModal.vue'
import RejectedModal from '@/pages/applications/modals/rejected/RejectedModal.vue'
import { loadModal } from '@/pages/applications/modals/reject/reject.model'
import CommentModal from '@/pages/applications/modals/comment/CommentModal.vue'
import { loadCommentModal } from '@/pages/applications/modals/comment/comment.model'
import { RefsType } from '@/pages/common/types'
import { ApplicationType } from '@/pages/applications/types'
import {
  setDataToDelete,
  $cannotDeleteData,
} from '@/pages/applications/modals/cannot-delete/cannot-delete.model'
import CannotDeleteModal from '@/pages/applications/modals/cannot-delete/CannotDeleteModal.vue'
import { mapApplicationTypeToRoute } from '@/pages/applications/constants'
import { navigatePush } from '@/features/navigation'
import DeleteModal from '@/pages/applications/modals/delete/DeleteModal.vue'
import { loadModal as loadDeleteModal } from '@/pages/applications/modals/delete/delete.model'
import { CheckBeforeDeletionResponseType } from '@/features/api/ticket/types'

Vue.component('VuetableFieldCheckbox', VuetableFieldCheckbox)

export default (Vue as VueConstructor<
  Vue & {
    $refs: RefsType
  }
>).extend({
  components: {
    PageHeader,
    GeneralFilter,
    ApplicationsFilter,
    TableHeader,
    TooltipCell,
    Actions,
    ContextMenu,
    Vuetable,
    VuetablePagination,
    RejectModal,
    RejectedModal,
    CommentModal,
    DeleteModal,
    CannotDeleteModal,
  },
  effector: {
    $visibility,
    $token,
    $session,
    canRefreshTableAfterReject: $canRefreshTable,
    $cannotDeleteData,
  },
  data() {
    return {
      searchFields: searchFieldsData,
      filterParams: {},
      total: 1,
      fields: incomingDeletionApplicationsDataFields,
      showContextMenu: false,
      contextMenuStyles: { top: '0', left: '0' },
      selectedApplications: [] as ApplicationType[],
      showTableHeaderActions: false,
      currentFailed: null as CheckBeforeDeletionResponseType | null,
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/ticket/deletion-ticket/list/?is_active=true`
    },
    showDeleteModal(): boolean {
      return !!this.currentFailed
    },
  },
  watch: {
    canRefreshTableAfterReject: {
      handler(newVal) {
        if (newVal) {
          this.$refs.vuetable.refresh()
          this.resetHeaderActions()
        }
      },
    },
    $cannotDeleteData: {
      handler() {
        this.showNextFailed()
      },
    },
  },
  methods: {
    toggleVisibility,
    loadList,
    reset,
    rejectApplications,
    acceptApplications(ids: number[]) {
      loadDeleteModal(ids)
    },
    checkIfElementCanBeDeleted(ids: number[]) {
      setDataToDelete(ids)
    },
    loadRejectApplications(ids: number[]) {
      loadModal(ids)
    },
    openApplications(data: ApplicationType) {
      navigatePush({
        name: `${mapApplicationTypeToRoute[data.type!]}-edit`,
        params: { id: `${data.task}` },
      })
    },
    showComment(id: number) {
      loadCommentModal(id)
    },
    toggleModal(val: boolean) {
      if (!val) {
        this.currentFailed = null
        this.showNextFailed()
      }
    },
    showNextFailed() {
      if (this.$cannotDeleteData.length === 0 || this.showDeleteModal) return
      this.currentFailed = this.$cannotDeleteData.shift()!
    },
    myFetch(apiUrl: string, httpOptions: any) {
      return axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
    },
    onFilterSet(newFilter: any) {
      this.filterParams = newFilter
      loadList({ ...this.filterParams })
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.filterParams = {}
      reset() // search string and field
      // reload data
      loadList({})
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage(page: any) {
      this.$refs.vuetable.changePage(page)
    },
    handleLoadError(res: any) {
      if (!res.response) {
        noInternetToastEvent()
      }
    },
    handleRightClick({ data, event }: RightClickParams) {
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      const taskId = data.taskId || data[data.object_type].id
      this.selectedApplications = [{ application: data.id, task: taskId, type: data.object_type }]
      this.showContextMenu = true
      this.contextMenuStyles = { top: `${event.y + scrollTop}px`, left: `${event.x + 120}px` }
      event.preventDefault()
    },
    handleRowClick(res: any) {
      if (res.event.target.closest('.actions-activator')) return
      const { selectedTo } = this.$refs.vuetable
      if (selectedTo.find((el: number) => el === res.data.id)) {
        selectedTo.splice(selectedTo.indexOf(res.data.id), 1)
        this.selectedApplications = this.selectedApplications.filter((el) =>
          selectedTo.find((currentId: number) => currentId === el.application)
        )
      } else {
        selectedTo.push(res.data.id)
        this.selectedApplications.push({
          application: res.data.id,
          task: res.data[res.data.object_type].id,
          type: res.data.object_type,
        })
      }
      this.showTableHeaderActions = selectedTo.length > 0
    },
    hideContextMenu() {
      this.selectedApplications = []
      this.showContextMenu = false
    },
    resetHeaderActions() {
      this.$refs.vuetable.selectedTo = []
      this.selectedApplications = []
      this.showTableHeaderActions = false
    },
  },
  created() {
    // Authorization request
    axios.interceptors.request.use((request) => {
      request.headers.Authorization = `Bearer ${this.$token}`
      return request
    })
  },
  mounted() {
    this.$events.$on('filter-set', (data: any) => this.onFilterSet(data))
    this.$events.$on('filter-reset', () => this.onFilterReset())
    loadList({})
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

.no-data-content {
  width: 100%;
  min-height: 550px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--base-text-secondary);
}
.no-data-content ~ .vuetable-pagination {
  margin: 0 !important;
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
