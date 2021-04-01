<template>
  <div id="applications-page">
    <PageHeader
      :table-columns-names="fields"
      :selected-rows="selectedApplications"
      :filter-params="filterParams"
      @setFilter="onFilterSet"
    />
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
      @showPreview="showPreview"
      @onEdit="editApplications"
      @onAccept="acceptApplications"
      @onSendForModeration="sendForModeration"
      @onAssignToModerator="assignToModerator"
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
        <template id="one" #actions="props">
          <Actions
            :selected-applications="[{ application: props.rowData.id, task: props.rowData.test_assignment.id }]"
            @showPreview="showPreview"
            @onEdit="editApplications"
            @onAccept="acceptApplications"
            @onSendForModeration="sendForModeration"
            @onAssignToModerator="assignToModerator"
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
      @showPreview="showPreview"
      @onEdit="editApplications"
      @onAccept="acceptApplications"
      @onSendForModeration="sendForModeration"
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
import { computeSortParam } from '@/pages/dictionary/themes/list/utils'
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
} from '@/pages/applications/incoming/incoming-applications-page.model'
import {
  toggleVisibility,
  $visibility,
} from '@/pages/applications/incoming/parts/filter/filter.model'
import { $session } from '@/features/session'
import SendForModerationModal from '@/pages/applications/modals/send-for-moderation/SendForModerationModal.vue'
import { loadModal } from '@/pages/applications/modals/send-for-moderation/send-for-moderation.model'
import SetToModeratorModal from '@/pages/applications/modals/set-to-moderator/SetToModeratorModal.vue'
import { loadModeratorModal } from '@/pages/applications/modals/set-to-moderator/set-to-moderator.model'
import { RefsType } from '@/pages/common/types'
import { ApplicationType } from '@/pages/applications/types'
import { navigatePush } from '@/features/navigation'

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
    Actions,
    ContextMenu,
    Vuetable,
    VuetablePagination,
    SendForModerationModal,
    SetToModeratorModal,
  },
  effector: {
    $visibility,
    $token,
    $session,
    $canRefreshTable,
  },
  data() {
    return {
      searchFields: searchFieldsData,
      filterParams: {},
      total: 1,
      fields: incomingApplicationsDataFields,
      showContextMenu: false,
      contextMenuStyles: { top: '0', left: '0' },
      selectedApplications: [] as ApplicationType[],
      showTableHeaderActions: false,
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/ticket/moderation-ticket/list/`
    },
  },
  watch: {
    $canRefreshTable: {
      handler(newVal) {
        if (newVal) this.$refs.vuetable.refresh()
      },
    },
  },
  methods: {
    toggleVisibility,
    loadList,
    reset,
    showPreview(ids: number[]) {
      ids.forEach((id) =>
        window.open(
          `${config.PREVIEW_URL}/question?questionId=${id}&type=test-assignment&token=${this.$token}`,
          '_blank'
        )
      )
    },
    editApplications(ids: number[]) {
      navigatePush({ name: 'test-tasks-edit', params: { id: `${ids[0]}` } })
    },
    acceptApplications(ids: number[]) {
      acceptApplicationsFx({ tickets: ids })
    },
    sendForModeration(ids: number[]) {
      loadModal(ids)
    },
    assignToModerator(ids: number[]) {
      loadModeratorModal(ids)
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
      this.selectedApplications = [{ application: data.id, task: data.test_assignment.id }]
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
