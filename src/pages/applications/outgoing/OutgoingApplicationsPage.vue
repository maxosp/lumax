<template>
  <div id="applications-page">
    <PageHeader :table-columns-names="fields" :selected-rows="selectedApplications" />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
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
    <TableHeader
      :total="total"
      :selected-applications="selectedApplications"
      :show-actions="showTableHeaderActions"
      @showPreview="showPreview"
      @onEdit="editApplications"
      @onCancel="cancelApplications"
      @onSeeComments="showComments"
    />

    <div :class="{ 'table-container': true, hideHeader: !total }">
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
            :id="props.rowData.id"
            :selected-applications="selectedApplications"
            @showPreview="showPreview"
            @onEdit="editApplications"
            @onCancel="cancelApplications"
            @onSeeComments="showComments"
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
      :selected-applications="selectedApplications"
      :style="contextMenuStyles"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @showPreview="showPreview"
      @onEdit="editApplications"
      @onCancel="cancelApplications"
      @onSeeComments="showComments"
    />
    <CancelModal @cancel="submitCancelApplications" />
    <OutgoingModal />
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
  outgoingApplicationsDataFields,
} from '@/pages/applications/outgoing/constants'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import PageHeader from '@/pages/applications/outgoing/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ApplicationsFilter from '@/pages/applications/outgoing/parts/filter/Filter.vue'
import TableHeader from '@/pages/applications/outgoing/parts/table/TableHeader.vue'
import Actions from '@/pages/applications/outgoing/parts/table/Actions.vue'
import ContextMenu from '@/pages/applications/outgoing/parts/ContextMenu.vue'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import {
  cancelApplicationsFx,
  loadList,
  $canUpdateTable,
  outgoingApplicationsPageParams,
} from '@/pages/applications/outgoing/outgoing-applications-page.model'
import {
  toggleVisibility,
  $visibility,
  outgoingApplicationsFilters,
} from '@/pages/applications/outgoing/parts/filter/filter.model'
import { $session } from '@/features/session'
import CancelModal from '@/pages/applications/modals/cancel/CancelModal.vue'
import { loadModal } from '@/pages/applications/modals/cancel/cancel.model'
import OutgoingModal from '@/pages/applications/modals/outgoing-comment/OutgoingComment.vue'
import { RefsType, HttpOptionsType } from '@/pages/common/types'
import { ApplicationType } from '@/pages/applications/types'
import { navigatePush } from '@/features/navigation'
import { loadCommentModal } from '@/pages/applications/modals/outgoing-comment/outgoing-comment.model'
import { changeTasks } from '@/pages/preview-tasks/tasks-dropdown/tasks-dropdown.model'
import { Ticket } from '@/features/api/ticket/types'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { combineRouteQueries, isQueryParamsEquelToPage } from '@/features/lib'

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
    CancelModal,
    OutgoingModal,
  },
  effector: {
    $visibility,
    $token,
    $session,
    canRefreshTableAfterCancel: $canUpdateTable,
    $filterParams: outgoingApplicationsFilters.store.$filterParams,
    $pageParams: outgoingApplicationsPageParams.store.$pageParams,
    $currentPage: outgoingApplicationsPageParams.store.currentPage,
  },
  data() {
    return {
      clickedRowId: 0,
      searchFields: searchFieldsData,
      total: 1,
      fields: outgoingApplicationsDataFields,
      showContextMenu: false,
      contextMenuStyles: { top: '0', left: '0' },
      selectedApplications: [] as ApplicationType[],
      showTableHeaderActions: false,
      localItems: [] as Ticket[],
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/ticket/moderation-ticket/list/`
    },
  },
  watch: {
    canRefreshTableAfterCancel: {
      handler(newVal) {
        if (newVal) {
          this.$refs.vuetable.refresh()
          this.resetHeaderActions()
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
    changeFilter: outgoingApplicationsFilters.methods.changeFilter,
    resetFilters: outgoingApplicationsFilters.methods.resetFilters,
    applyFilters: outgoingApplicationsFilters.methods.applyFilters,
    changePage: outgoingApplicationsPageParams.methods.changePage,
    queryToParams: outgoingApplicationsPageParams.methods.queryToParams,
    toggleVisibility,
    loadList,
    reset,
    showPreview(idArr: number[]) {
      if (idArr.length > 1) {
        const filteredList = this.localItems
          .filter(
            (item) => idArr.filter((itemArr) => itemArr === item.test_assignment.id).length > 0
          )
          .map((item) => ({
            id: item.test_assignment.id,
            name: `${item.test_assignment.id}`,
            title: item.test_assignment.theme.name,
          }))
        changeTasks(filteredList)
      }
      this.$router.push({
        name: 'preview-task',
        query: {
          questions: idArr.join(','),
          type: 'test-assignment',
          token: this.$token,
          application: 'true',
        },
      })
    },
    editApplications(ids: number[]) {
      navigatePush({ name: 'test-tasks-edit', params: { id: `${ids[0]}` } })
    },
    cancelApplications(ids: number[]) {
      loadModal(ids)
    },
    submitCancelApplications(ids: number[]) {
      cancelApplicationsFx({ tickets: ids })
    },
    showComments(ids: number[]) {
      loadCommentModal(ids[0])
    },
    async myFetch(apiUrl: string, httpOptions: HttpOptionsType) {
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
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
      this.$refs.pagination.setPaginationData(paginationData)
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
      this.clickedRowId = data.id
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
