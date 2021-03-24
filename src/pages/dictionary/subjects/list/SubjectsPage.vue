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
    />
    <div class="table-container">
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
            @onRemove="removeSelected"
            @doMondatory="updateTypeSubject($event, true)"
            @doOptional="updateTypeSubject($event, false)"
            @doMondatoryAll="updateTypeSubject($event, true)"
            @doOptionalAll="updateTypeSubject($event, false)"
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
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :selected="selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="removeSelected"
      @doMondatory="updateTypeSubject($event, true)"
      @doOptional="updateTypeSubject($event, false)"
      @doMondatoryAll="updateTypeSubject($event, true)"
      @doOptionalAll="updateTypeSubject($event, false)"
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
import { computeSortParam } from '@/pages/dictionary/themes/list/utils'
import GridPageHead from '@/pages/common/grid-parts/GridPageHead.vue'
import TooltipCell from '@/pages/common/grid-parts/TooltipCell.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import Actions from '@/pages/dictionary/subjects/list/parts/Actions.vue'
import ContextMenu from '@/pages/dictionary/subjects/list/parts/ContextMenu.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  deleteSubject,
  deleteManySubjects,
  changeIdSubject,
  changeIsMondatory,
  $triggerToRefreshTable,
} from '@/pages/dictionary/subjects/list/subjects-page.model'
import { noInternetToastEvent } from '@/features/toasts/toasts.model'
import { subjectsTableFields, searchFieldsData } from '@/pages/dictionary/subjects/list/constants'
import { ContextMenuType } from '@/pages/dictionary/subjects/list/types'
import { RefsType } from '@/pages/common/types'

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
  name: 'SubjectsGridPage',
  components: {
    Vuetable,
    GridPageHead,
    GeneralFilter,
    TooltipCell,
    Actions,
    ContextMenu,
    BaseButton,
  },
  effector: {
    $token,
    $triggerToRefreshTable,
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
      filterParams: {},
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/subject/subjects/list/`
    },
    selectedRows(): number[] {
      if (!this.$refs.vuetable) return []
      return this.$refs.vuetable.selectedTo
    },
  },
  watch: {
    $triggerToRefreshTable() {
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
  },
  methods: {
    myFetch(apiUrl: string, httpOptions: any) {
      return axios.get(apiUrl, {
        params: { sort: computeSortParam(httpOptions.params.sort) },
      })
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
    },
    resetAllFilters() {
      this.filterParams = {}
      reset() // search string and field

      const resetEvent = new Event('reset-themes-filter')
      const container = document.querySelector('#subjects-page')
      container && container.dispatchEvent(resetEvent)

      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterSet(newFilter: any) {
      this.filterParams = newFilter
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.filterParams = {}
      reset() // search string and field

      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    // TODO like removeSelected
    updateTypeSubject(ids: number | number[], isMondatory: boolean) {
      if (typeof ids === 'number') {
        changeIsMondatory(isMondatory)
        changeIdSubject(ids)
      }
    },
    // TODO delete all
    async removeSelected(ids: number | number[]) {
      if (typeof ids === 'number') await deleteSubject(ids)
      else await deleteManySubjects(ids)
      await Vue.nextTick(() => this.$refs.vuetable.refresh())
      if (typeof ids !== 'number') this.$refs.vuetable.selectedTo = []
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
  mounted() {
    this.$events.$on('filter-set', (data: any) => this.onFilterSet(data))
    this.$events.$on('filter-reset', () => this.onFilterReset())
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
