<template>
  <div id="subjects-page">
    <GridPageHead title="Справочник">
      <RouterLink :to="{ name: 'subjects-create' }">
        <BaseButton class="btn" yellow>
          Создать предмет
        </BaseButton>
      </RouterLink>
    </GridPageHead>
    <GeneralFilter
      :is-show-filter="false"
      :search-fields="searchFields"
      @setFilter="onFilterSet"
      @resetFilter="onFilterReset"
      @changeFilter="changeFilter"
    />
    <LoaderBig v-if="$isLoading" />
    <div :class="{ 'table-container': true, invisible: $isLoading }">
      <Vuetable
        ref="vuetable"
        class="table"
        :api-mode="true"
        :api-url="apiUrl"
        :fields="fields"
        :http-fetch="myFetch"
        :append-params="$filterParams"
        pagination-path=""
        :per-page="25"
        @vuetable:load-error="handleLoadError"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:cell-rightclicked="handleRightClick"
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
            @onRemove="onRemoveSubjects"
            @doMondatory="updateTypeSubject($event, true)"
            @doOptional="updateTypeSubject($event, false)"
            @doMondatoryAll="updateTypeSubject($event, true)"
            @doOptionalAll="updateTypeSubject($event, false)"
          />
        </template>
      </Vuetable>
      <NoDataContent
        v-if="!total"
        @resetFilters="onFilterReset"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :selected="selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="onRemoveSubjects"
      @doMondatory="updateTypeSubject($event, true)"
      @doOptional="updateTypeSubject($event, false)"
      @doMondatoryAll="updateTypeSubject($event, true)"
      @doOptionalAll="updateTypeSubject($event, false)"
    />
    <ConfirmDeleteModal
      type="subject"
      @confirmDelete="removeSelectedSubject"
    />
    <RequestDeleteModal
      @confirmRequestDelete="sendRequestDeleteSubject"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VueEvents from 'vue-events'
import { Vuetable, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import GridPageHead from '@/pages/common/grid-parts/GridPageHead.vue'
import TooltipCell from '@/pages/common/grid-parts/TooltipCell.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import Actions from '@/pages/dictionary/subjects/list/parts/Actions.vue'
import ContextMenu from '@/pages/dictionary/subjects/list/parts/ContextMenu.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  changeIdSubject,
  changeIsMondatory,
  $triggerToRefreshTable,
  subjectsFilters,
  deleteSubjects,
  requestDeleteSubjects,
  $isLoading,
} from '@/pages/dictionary/subjects/list/subjects-page.model'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { subjectsTableFields, searchFieldsData } from '@/pages/dictionary/subjects/list/constants'
import { HttpOptionsType, RefsType, RightClickParams } from '@/pages/common/types'
import NoDataContent from '@/pages/common/parts/no-data-content/NoDataContent.vue'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { loadRequestDeleteModal } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import RequestDeleteModal from '@/pages/common/modals/request-delete/RequestDeleteModal.vue'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import { $session } from '@/features/session'
import { computeSortParam } from '@/features/lib'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'

Vue.use(VueEvents)
Vue.component('VuetableFieldCheckbox', VuetableFieldCheckbox)

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: RefsType
    }
  >
).extend({
  name: 'SubjectsGridPage',
  components: {
    Vuetable,
    GridPageHead,
    GeneralFilter,
    TooltipCell,
    Actions,
    ContextMenu,
    BaseButton,
    NoDataContent,
    ConfirmDeleteModal,
    RequestDeleteModal,
    LoaderBig,
  },
  effector: {
    $token,
    $triggerToRefreshTable,
    $filterParams: subjectsFilters.store.$filterParams,
    $session,
    $isLoading,
  },
  data() {
    return {
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_subjects',
      contextMenuStyles: { top: '0', left: '0' },
      fields: subjectsTableFields,
      searchFields: searchFieldsData,
      total: 0,
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/subject-app/subjects/list/`
    },
    selectedRows(): number[] {
      if (!this.$refs.vuetable) return []
      return this.$refs.vuetable.selectedTo
    },
  },
  watch: {
    $triggerToRefreshTable() {
      Vue.nextTick(() => this.$refs.vuetable.reload())
    },
  },
  methods: {
    changeFilter: subjectsFilters.methods.changeFilter,
    resetFilters: subjectsFilters.methods.resetFilters,
    applyFilters: subjectsFilters.methods.applyFilters,
    myFetch(apiUrl: string, httpOptions: HttpOptionsType) {
      return axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
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
    // TODO like removeSelected
    updateTypeSubject(ids: number | number[], isMondatory: boolean) {
      if (typeof ids === 'number') {
        changeIsMondatory(isMondatory)
        changeIdSubject(ids)
      }
    },
    // TODO delete all
    onRemoveSubjects(ids: number[]) {
      this.$session?.permissions?.subjects_subject?.delete
        ? loadConfirmDeleteModal(ids)
        : loadRequestDeleteModal(ids)
    },
    async removeSelectedSubject(ids: number[]) {
      await deleteSubjects(ids)
      await Vue.nextTick(() => this.$refs.vuetable.reload())
      this.removeSelection()
    },
    async sendRequestDeleteSubject(comment: string, ids: number[]) {
      await requestDeleteSubjects({ subjects: ids, ticket_comment: comment })
      this.removeSelection()
    },
    removeSelection() {
      this.$refs.vuetable.selectedTo = []
      this.selectedRows = []
    },
    handleLoadError(res: any) {
      if (!res.response) noInternetToastEvent()
    },
    handleRightClick({ data, event, type = 'table_subjects' }: RightClickParams) {
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

.table /deep/ .round-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 0 auto;
}
.table /deep/ .image-subject {
  width: 36px;
  height: 36px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  margin: 0 auto;
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
