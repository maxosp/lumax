<template>
  <div id="themes-page">
    <PageHeader />
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
      v-if="!$isLoading"
      :total="$treeView ? $themesTreeTotal : total"
      :selected-rows="selectedRows"
      @onEdit="handleEditTheme"
      @onRemove="onRemoveThemes"
    />
    <LoaderBig v-if="$isLoading" />
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
        :per-page="25"
        pagination-path=""
        @vuetable:load-error="handleLoadError"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:cell-rightclicked="handleRightClick"
        @vuetable:row-clicked="handleRowClick"
      >
        <template #name="props">
          <TooltipCell
            :title="props.rowData.name"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template id="one" #actions="props">
          <Actions
            :id="props.rowData.id"
            :selected="selectedRows"
            @onRemove="onRemoveThemes"
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
      <ThemesTree
        @onRightClick="handleRightClick"
        @loadTree="val => loadTree(val)"
        @resetFilter="onFilterReset"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :selected="$treeView ? [] : selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      :subject="subject"
      :study-year="studyYear"
      :theme="theme"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="onRemoveThemes"
    />
    <ConfirmDeleteModal
      type="theme"
      @confirmDelete="removeSelectedThemes"
    />
    <RequestDeleteModal
      @confirmRequestDelete="sendRequestDeleteTheme"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueEvents from 'vue-events'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import PageHeader from '@/pages/dictionary/themes/list/parts/PageHeader.vue'
import TableHeader from '@/pages/dictionary/themes/list/parts/TableHeader.vue'
import TooltipCell from '@/pages/dictionary/themes/list/parts/TooltipCell.vue'
import Actions from '@/pages/dictionary/themes/list/parts/Actions.vue'
import ContextMenu from '@/pages/dictionary/themes/list/parts/ContextMenu.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ThemesFilter from '@/pages/dictionary/themes/list/parts/themes-filter/ThemesFilter.vue'
import ThemesTree from '@/pages/dictionary/themes/list/parts/themes-tree/ThemesTree.vue'
import {
  loadTreeLight,
  loadTree,
  $themesTreeTotal,
  deleteThemes,
  requestDeleteThemes,
  themesPageParams,
  $isLoading,
} from '@/pages/dictionary/themes/list/themes-page.model'
import {
  toggleVisibility,
  $visibility,
  themesFilters,
} from '@/pages/dictionary/themes/list/parts/themes-filter/themes-filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { themesTableFields, searchFieldsData } from '@/pages/dictionary/themes/list/constants'
import { ContextMenuType } from '@/pages/dictionary/themes/list/types'
import { navigatePush } from '@/features/navigation'
import { $session } from '@/features/session'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { RefsType, HttpOptionsType } from '@/pages/common/types'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import RequestDeleteModal from '@/pages/common/modals/request-delete/RequestDeleteModal.vue'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { loadRequestDeleteModal } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { combineRouteQueries, computeSortParam, isQueryParamsEquelToPage } from '@/features/lib'
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
  name: 'ThemesPage',
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
    ThemesTree,
    NoDataContent,
    ConfirmDeleteModal,
    RequestDeleteModal,
    LoaderBig,
  },
  effector: {
    $token,
    $visibility,
    $themesTreeTotal,
    $session,
    $filterParams: themesFilters.store.$filterParams,
    $pageParams: themesPageParams.store.$pageParams,
    $treeView: themesPageParams.store.treeView,
    $currentPage: themesPageParams.store.currentPage,
    $isLoading,
  },
  data() {
    return {
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_theme',
      contextMenuStyles: { top: '0', left: '0' },
      fields: themesTableFields,
      searchFields: searchFieldsData,
      total: 0,
      selectedRows: [] as number[] | null,
      subject: null,
      studyYear: null,
      theme: null,
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/subject/themes/list/`
    },
  },
  watch: {
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
    changeFilter: themesFilters.methods.changeFilter,
    resetFilters: themesFilters.methods.resetFilters,
    applyFilters: themesFilters.methods.applyFilters,
    toggleTreeView: themesPageParams.methods.toggleTreeView,
    changePage: themesPageParams.methods.changePage,
    queryToParams: themesPageParams.methods.queryToParams,
    loadTree,
    toggleVisibility,
    myFetch(apiUrl: string, httpOptions: HttpOptionsType) {
      return axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
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
    handleRowClick(res: any) {
      if (res.event.target.closest('.actions-activator')) return
      const { selectedTo } = this.$refs.vuetable
      if (selectedTo.length === 0) selectedTo.push(res.data.id)
      else if (selectedTo.find((el: number) => el === res.data.id)) {
        selectedTo.splice(selectedTo.indexOf(res.data.id), 1)
      } else selectedTo.push(res.data.id)
      this.selectedRows = this.$refs.vuetable.selectedTo
    },
    onRemoveThemes(ids: number[]) {
      this.$session?.permissions?.subjects_theme?.delete
        ? loadConfirmDeleteModal(ids)
        : loadRequestDeleteModal(ids)
    },
    async removeSelectedThemes(ids: number[]) {
      await deleteThemes(ids)
      await Vue.nextTick(() => this.$refs.vuetable.reload())
      this.removeSelection()
    },
    async sendRequestDeleteTheme(comment: string, ids: number[]) {
      await requestDeleteThemes({ themes: ids, ticket_comment: comment })
      this.removeSelection()
    },
    removeSelection() {
      this.$refs.vuetable.selectedTo = []
      this.selectedRows = []
    },
    handleEditTheme(id: number) {
      navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
    },
    handleLoadError(res: any) {
      if (!res.response) noInternetToastEvent()
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
      if (this.$treeView) {
        this.subject = data.subject
        this.studyYear = data.studyYear
        this.theme = data.id
      }
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.clickedRowId = data.id
      this.showContextMenu = true
      this.contextMenuType = type
      this.contextMenuStyles = { top: `${event.y + scrollTop}px`, left: `${event.x + 120}px` }
      event.preventDefault()
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
