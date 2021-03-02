<template>
  <div id="marks-page">
    <PageHeader />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
    >
      <template #filter>
        <LabelsFilter
          :visible="$visibility"
          :filter-params="filterParams"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
        />
      </template>
    </GeneralFilter>
    <div>
      <LabelsTree @onRightClick="handleRightClick" />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :key="clickedRowId"
      :selected="[]"
      :style="contextMenuStyles"
      :type="contextMenuType"
      class="context-menu"
      :class-id="class_id"
      :subject-id="subject_id"
      :theme-id="theme_id"
      @onOutsideClick="hideContextMenu"
      @onRemove="removeSelected"
      @onEdit="editLabel"
      @showTasks="showTasks"
      @createLabel="(val) => createLabelFromTree(val)"
    />
    <LabelCreationModal />
    <LabelEditionModal />
    <LabelDeletionModal />
    <TasksModal />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageHeader from '@/pages/labels/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import LabelsFilter from '@/pages/labels/parts/labels-filter/LabelsFilter.vue'
import LabelsTree from '@/pages/labels/parts/tree/LabelsTree.vue'
import ContextMenu from '@/pages/labels/parts/ContextMenu.vue'
import LabelCreationModal from '@/pages/labels/parts/modals/label-creation/LabelCreationModal.vue'
import LabelEditionModal from '@/pages/labels/parts/modals/label-edition/LabelEditionModal.vue'
import LabelDeletionModal from '@/pages/labels/parts/modals/label-deletion/LabelDeletionModal.vue'
import TasksModal from '@/pages/labels/parts/modals/tasks/TasksModal.vue'
import {
  $visibility,
  toggleVisibility,
} from '@/pages/labels/parts/labels-filter/labels-filter.model'
import { loadTree } from '@/pages/labels/labels-page.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { searchFieldsData } from '@/pages/labels/constants'
import { RightClickParams } from '@/pages/labels/types'
import { loadModalToEdit } from '@/pages/labels/parts/modals/label-edition/label-edition.modal'
import { loadModal } from '@/pages/labels/parts/modals/tasks/tasks.model'
import { loadModalToDelete } from '@/pages/labels/parts/modals/label-deletion/label-deletion.model'
import { createLabelFromTree } from '@/pages/labels/parts/modals/label-creation/label-creation.model'

export default Vue.extend({
  components: {
    PageHeader,
    GeneralFilter,
    LabelsFilter,
    LabelsTree,
    ContextMenu,
    LabelCreationModal,
    LabelEditionModal,
    LabelDeletionModal,
    TasksModal,
  },
  effector: {
    $visibility,
  },
  data() {
    return {
      filterParams: {},
      searchFields: searchFieldsData,
      clickedRowId: 0,
      showContextMenu: false,
      contextMenuType: 'table_theme',
      contextMenuStyles: { top: '0', left: '0' },
      subject_id: null,
      class_id: null,
      theme_id: null,
    }
  },
  methods: {
    toggleVisibility,
    createLabelFromTree,
    onFilterSet(newFilter: any) {
      this.filterParams = newFilter
      loadTree({ ...this.filterParams })
    },
    onFilterReset() {
      this.filterParams = {}
      reset() // search string and field
      // reload data
      loadTree({})
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
      this.subject_id = data.subject_id
      this.class_id = data.class_id
      this.theme_id = data.id
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.clickedRowId = data.id
      this.contextMenuType = type
      this.contextMenuStyles = { top: `${event.y + scrollTop}px`, left: `${event.x + 120}px` }
      this.showContextMenu = true
      event.preventDefault()
    },
    hideContextMenu() {
      this.showContextMenu = false
    },
    removeSelected(ids: number) {
      loadModalToDelete(ids)
    },
    showTasks(id: number) {
      loadModal(id)
    },
    editLabel(id: number) {
      loadModalToEdit(id)
    },
  },
  mounted() {
    this.$events.$on('filter-set', (data: any) => this.onFilterSet(data))
    this.$events.$on('filter-reset', () => this.onFilterReset())
    loadTree({})
  },
})
</script>

<style scoped>
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
