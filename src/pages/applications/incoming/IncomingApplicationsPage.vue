<template>
  <div id="applications-page">
    <PageHeader
      :table-columns-names="fields"
      @setFilter="onFilterSet"
      @changeFilter="changeFilter"
    />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
      @resetFilter="onFilterReset"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <ApplicationsFilter
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
      :selected-applications="selectedApplications"
      :show-actions="showTableHeaderActions"
      @showPreview="showPreview"
      @onEdit="editApplications"
      @onAccept="acceptApplications"
      @onSendToRevision="sendToRevision"
      @onAssignToModerator="assignToModerator"
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
      >
        <template id="one" #actions="props">
          <Actions
            :application-id="props.rowData.id"
            :task-id="props.rowData.test_assignment.id"
            :selected-applications="selectedApplications"
            @showPreview="showPreview"
            @onEdit="editApplications"
            @onAccept="acceptApplications"
            @onSendToRevision="sendToRevision"
            @onAssignToModerator="assignToModerator"
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
      :key="clickedRowApplicationId"
      :application-id="clickedRowApplicationId"
      :task-id="clickedRowTaskId"
      :selected-applications="selectedApplications"
      :style="contextMenuStyles"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @showPreview="showPreview"
      @onEdit="editApplications"
      @onAccept="acceptApplications"
      @onSendToRevision="sendToRevision"
      @onAssignToModerator="assignToModerator"
    />
    <SendForModerationModal />
    <SetToModeratorModal />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { RightClickParams } from '@/pages/bank/olympiad-tasks/types'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import {
  searchFieldsData,
  incomingApplicationsDataFields,
} from '@/pages/applications/incoming/constants'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import PageHeader from '@/pages/applications/incoming/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ApplicationsFilter from '@/pages/applications/incoming/parts/filter/Filter.vue'
import TableHeader from '@/pages/applications/incoming/parts/table/TableHeader.vue'
import Actions from '@/pages/applications/incoming/parts/table/Actions.vue'
import ContextMenu from '@/pages/applications/incoming/parts/ContextMenu.vue'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import {
  loadList,
  acceptApplicationsFx,
  $canRefreshTable,
  incomingApplicationsPageParams,
  canRefreshTableChanged,
  $isLoading,
} from '@/pages/applications/incoming/incoming-applications-page.model'
import {
  toggleVisibility,
  $visibility,
  incomingApplicationsFilters,
} from '@/pages/applications/incoming/parts/filter/filter.model'
import { $session } from '@/features/session'
import SendForModerationModal from '@/pages/applications/modals/send-for-moderation/SendForModerationModal.vue'
import { loadModal } from '@/pages/applications/modals/send-for-moderation/send-for-moderation.model'
import SetToModeratorModal from '@/pages/applications/modals/set-to-moderator/SetToModeratorModal.vue'
import { loadModeratorModal } from '@/pages/applications/modals/set-to-moderator/set-to-moderator.model'
import { RefsType, HttpOptionsType } from '@/pages/common/types'
import { ApplicationType } from '@/pages/applications/types'
import { navigatePush } from '@/features/navigation'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { changeTasks } from '@/pages/preview-tasks/parts/tasks-dropdown/tasks-dropdown.model'
import { Ticket } from '@/features/api/ticket/types'
import {
  combineRouteQueries,
  computeSortParam,
  cropString,
  isQueryParamsEquelToPage,
} from '@/features/lib'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'
import { DEFAULT_ID } from '@/pages/common/constants'

Vue.component('VuetableFieldCheckbox', VuetableFieldCheckbox)
export default (Vue as VueConstructor<
  Vue & {
    $refs: RefsType
  }
>).extend({
  components: {
    NoDataContent,
    PageHeader,
    GeneralFilter,
    ApplicationsFilter,
    TableHeader,
    Actions,
    ContextMenu,
    Vuetable,
    VuetablePagination,
    SendForModerationModal,
    SetToModeratorModal,
    LoaderBig,
  },
  effector: {
    $visibility,
    $token,
    $session,
    $canRefreshTable,
    $filterParams: incomingApplicationsFilters.store.$filterParams,
    $pageParams: incomingApplicationsPageParams.store.$pageParams,
    $currentPage: incomingApplicationsPageParams.store.currentPage,
    $isLoading,
  },
  data() {
    return {
      clickedRowApplicationId: DEFAULT_ID,
      clickedRowTaskId: DEFAULT_ID,
      searchFields: searchFieldsData,
      total: 1,
      fields: incomingApplicationsDataFields,
      showContextMenu: false,
      contextMenuStyles: { top: '0', left: '0' },
      selectedApplications: [] as ApplicationType[],
      showTableHeaderActions: false,
      localItems: [] as Ticket[],
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/ticket-app/moderation-ticket/list/`
    },
  },
  watch: {
    $canRefreshTable: {
      handler(newVal) {
        if (newVal === true) {
          this.$refs.vuetable.reload()
          canRefreshTableChanged(false)
        }
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
    changeFilter: incomingApplicationsFilters.methods.changeFilter,
    resetFilters: incomingApplicationsFilters.methods.resetFilters,
    applyFilters: incomingApplicationsFilters.methods.applyFilters,
    changePage: incomingApplicationsPageParams.methods.changePage,
    queryToParams: incomingApplicationsPageParams.methods.queryToParams,
    toggleVisibility,
    loadList,
    reset,
    showPreview(applicationIds: number[], taskIds: number[]) {
      this.transferSelectedApps(applicationIds)
      navigatePush({
        name: 'preview-task',
        query: {
          questions: taskIds.join(','),
          taskType: 'test-assignment',
          applications: applicationIds.join(','),
          token: this.$token,
          fromPage: 'applications',
        },
      })
    },
    editApplications(applicationIds: number[], taskIds: number[]) {
      this.transferSelectedApps(applicationIds)
      navigatePush({
        name: 'test-tasks-edit',
        query: {
          questions: taskIds.join(','),
          applications: applicationIds.join(','),
          fromPage: 'applications',
        },
        params: { id: `${taskIds[0]}` },
      })
    },
    transferSelectedApps(applicationIds: number[]) {
      if (applicationIds.length > 1) {
        const filteredList = this.localItems
          .filter((item) => applicationIds.includes(item.id))
          .map((item) => ({
            id: item.test_assignment.id,
            name: `${item.test_assignment.id}`,
            title: `[id${item.test_assignment.id}] - ${cropString(
              item.test_assignment.wording,
              34
            )}`,
          }))
        changeTasks(filteredList)
      }
    },
    acceptApplications(ids: number[]) {
      acceptApplicationsFx({ tickets: ids })
      this.removeSelection()
    },
    sendToRevision(ids: number[]) {
      loadModal(ids)
      this.removeSelection()
    },
    assignToModerator(ids: number[]) {
      loadModeratorModal(ids)
      this.removeSelection()
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
      if (!res.response) {
        noInternetToastEvent()
      }
    },
    handleRightClick({ data, event }: RightClickParams) {
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.clickedRowApplicationId = data.id
      this.clickedRowTaskId = data.test_assignment.id
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
          task: res.data.test_assignment.id,
        })
      }
      this.showTableHeaderActions = selectedTo.length > 0
    },
    removeSelection() {
      this.$refs.vuetable.selectedTo = []
      this.selectedApplications = []
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
