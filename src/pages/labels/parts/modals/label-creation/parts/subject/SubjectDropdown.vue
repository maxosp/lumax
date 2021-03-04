<template>
  <FilterDropdown
    label="Предмет"
    placeholder="Выберите предмет"
    :methods="subjectModuleMethods"
    :data="$subjects"
    :store="{ $item, $itemsDropdown, $searchString }"
    @item-changed="(val) => setSelectedSubject({ id: +val.name })"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FilterDropdown from '@/pages/common/filter-dropdown/FilterDropdown.vue'
import {
  $subjects,
  loadSubjects,
  subjectDropdownModule,
  setSelectedSubject,
} from '@/pages/labels/parts/modals/label-creation/parts/subject/subject-dropdown.model'

export default Vue.extend({
  components: {
    FilterDropdown,
  },
  effector: {
    $subjects,
    ...subjectDropdownModule.store,
  },
  data() {
    return {
      subjectModuleMethods: subjectDropdownModule.methods,
    }
  },
  methods: { setSelectedSubject },
  mounted() {
    loadSubjects()
  },
})
</script>
