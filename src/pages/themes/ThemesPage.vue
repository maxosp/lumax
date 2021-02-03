<template>
  <div v-if="!$isLoading">
    <TableHeader :total="total" />
    <Vuetable
      ref="vuetable"
      class="table"
      :api-mode="true"
      :api-url="apiUrl"
      :fields="fields"
      :http-fetch="myFetch"
      pagination-path=""
      @vuetable:pagination-data="onPaginationData"
    >
      <template v-slot:actions="props">
        <Actions
          :row-data="props.rowData"
          :row-index="props.rowIndex"
          :row-field="props.rowField"
        />
      </template>
    </Vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <VuetablePagination
        ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Vuetable, VuetablePagination, VuetableFieldCheckbox } from 'vuetable-2'
import axios from 'axios'
import { config } from '@/config'
import { $token } from '@/features/api/common/request'
import { $themes, $isLoading } from '@/pages/themes/themes-page.model'
import { themesTableFields } from '@/pages/themes/constants'
import { computeSortParam } from '@/pages/themes/utils'
import TableHeader from '@/pages/themes/parts/Header.vue'
import Actions from '@/pages/themes/parts/Actions.vue'

// eslint-disable-next-line
Vue.component('vuetable-field-checkbox', VuetableFieldCheckbox)

export default Vue.extend({
  name: 'ThemesPage',
  components: { Vuetable, VuetablePagination, TableHeader, Actions },
  effector: {
    $themes,
    $isLoading,
    $token,
  },
  data() {
    return {
      fields: themesTableFields,
      total: 0,
    }
  },
  computed: {
    apiUrl() {
      return `${config.BACKEND_URL}/api/subject/themes/list/`
    },
  },
  methods: {
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
</style>
