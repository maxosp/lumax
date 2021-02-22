<template>
  <div id="themes-page">
    <PageHeader />
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
    <TableHeader :total="$treeView ? $themesTreeTotal : total" />
    <div :class="{ 'table-container': true, invisible: $treeView }">
      <Vuetable
        ref="vuetable"
        class="table"
        :api-mode="true"
        :api-url="apiUrl"
        :fields="fields"
        :http-fetch="myFetch"
        :append-params="filterParams"
        no-data-template=""
        pagination-path=""
        @vuetable:load-error="handleLoadError"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:cell-rightclicked="handleRightClick"
      >
        <template v-slot:name="props">
          <TooltipCell
            :title="props.rowData.name"
            :row-id="props.rowData.id"
            @onRightClick="handleRightClick"
          />
        </template>
        <template id="one" v-slot:actions="props">
          <Actions
            :id="props.rowData.id"
            :selected="selectedRows"
            @onRemove="removeSelected"
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
      <ThemesTree @onRightClick="handleRightClick" />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :selected="$treeView ? [] : selectedRows"
      :style="contextMenuStyles"
      :type="contextMenuType"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="removeSelected"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueEvents from 'vue-events'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { computeSortParam } from '@/pages/themes/utils'
import PageHeader from '@/pages/themes/parts/PageHeader.vue'
import TableHeader from '@/pages/themes/parts/TableHeader.vue'
import TooltipCell from '@/pages/themes/parts/TooltipCell.vue'
import Actions from '@/pages/themes/parts/Actions.vue'
import ContextMenu from '@/pages/themes/parts/ContextMenu.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import ThemesFilter from '@/pages/themes/parts/themes-filter/ThemesFilter.vue'
import ThemesTree from '@/pages/themes/parts/themes-tree/ThemesTree.vue'
import {
  $treeView,
  loadTree,
  $themesTreeTotal,
  deleteTheme,
} from '@/pages/themes/themes-page.model'
import {
  toggleVisibility,
  $visibility,
} from '@/pages/themes/parts/themes-filter/themes-filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { addToast } from '@/features/toasts/toasts.model'
import { themesTableFields, searchFieldsData } from '@/pages/themes/constants'
import { ContextMenuType } from '@/pages/themes/types'

Vue.use(VueEvents)
// eslint-disable-next-line
Vue.component('vuetable-field-checkbox', VuetableFieldCheckbox)

type RightClickParams = {
  data: any
  event: any
  type?: ContextMenuType
}

export default Vue.extend({
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
  },
  effector: {
    $token,
    $visibility,
    $treeView,
    $themesTreeTotal,
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
      filterParams: {},
    }
  },
  computed: {
    apiUrl(): string {
      return `${config.BACKEND_URL}/api/subject/themes/list/`
    },
    selectedRows(): number[] {
      // @ts-ignore
      if (!this.$refs.vuetable) return []
      // @ts-ignore
      return this.$refs.vuetable.selectedTo
    },
  },
  methods: {
    toggleVisibility,
    myFetch(apiUrl: string, httpOptions: any) {
      return axios.get(apiUrl, {
        params: { ...httpOptions.params, sort: computeSortParam(httpOptions.params.sort) },
      })
    },
    onPaginationData(paginationData: any) {
      this.total = paginationData.total
      // @ts-ignore
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage(page: any) {
      // @ts-ignore
      this.$refs.vuetable.changePage(page)
    },
    resetAllFilters() {
      this.filterParams = {}
      reset() // search string and field

      const resetEvent = new Event('reset-themes-filter')
      const container = document.querySelector('#themes-page')
      container && container.dispatchEvent(resetEvent)

      // reload data
      loadTree({})
      // @ts-ignore
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterSet(newFilter: any) {
      this.filterParams = newFilter
      loadTree({ ...this.filterParams })
      // @ts-ignore
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.filterParams = {}
      reset() // search string and field

      // reload data
      loadTree({})
      // @ts-ignore
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    async removeSelected(ids: number | number[]) {
      if (typeof ids === 'number') {
        await deleteTheme(ids)
        // @ts-ignore
        await Vue.nextTick(() => this.$refs.vuetable.refresh())
      }
    },
    handleLoadError(res: any) {
      if (!res.response) {
        addToast({ type: 'no-internet', message: 'Отсутствует подключение' })
      }
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
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
  display: flex;
  justify-content: center;
  background-color: transparent !important;
  margin: 30px 0 !important;
  position: sticky;
  left: 0;
  & ::v-deep .pagination {
    min-height: unset;
    border: unset;
    box-shadow: unset;
    background-color: transparent;
    .item {
      width: 30px;
      min-width: unset;
      height: 30px;
      padding: 0;
      border-radius: 7px !important;
      border: 2px solid var(--base-text-primary);
      background-color: transparent;
      line-height: 18px;
      font-weight: 600;
      color: var(--base-text-primary);
      @mixin flex-center;
      &.active {
        padding: 0;
        border-top: 2px solid var(--base-text-primary);
        color: #fff;
        background-color: var(--base-text-primary);
      }
      &.disabled {
        opacity: 0.5;
      }
      &::before {
        display: none;
      }
      &.btn-nav {
        @mixin flex-center;
        .icon {
          height: fit-content;
          width: 10px;
          opacity: 1;
          margin: 0;
        }
        .icon.chevron {
          content: url('~assets/icons/icons/chevron-single.svg');
          position: relative;
          left: 1px;
        }
        .icon.right.chevron {
          transform: rotate(180deg);
          left: -1px;
        }
        .icon.double {
          content: url('~assets/icons/icons/chevron-double.svg');
        }
        .icon.double.right {
          transform: rotate(180deg);
        }
        .icon::before,
        .icon::after {
          content: '';
        }
      }
    }
    .item:not(:last-child) {
      margin-right: 10px;
    }
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
