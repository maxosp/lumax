<template>
  <div v-if="!$isLoading">
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
import Actions from '@/pages/themes/parts/Actions.vue'

// eslint-disable-next-line
Vue.component('vuetable-field-checkbox', VuetableFieldCheckbox)

export default Vue.extend({
  name: 'ThemesPage',
  components: { Vuetable, VuetablePagination, Actions },
  effector: {
    $themes,
    $isLoading,
    $token,
  },
  data() {
    return {
      fields: themesTableFields,
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
.table /deep/ .ui.blue.table {
  border-color: var(--c-grey-9);
}
.table /deep/ .vuetable-slot {
  overflow: initial !important;
}
.table /deep/ th[class^='vuetable-th'] {
  color: var(--base-text-primary);
  font-weight: 600;
}
</style>
