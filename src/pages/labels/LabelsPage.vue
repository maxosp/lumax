<template>
  <div id="marks-page">
    <PageHeader />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <LabelsFilter
          :visible="$visibility"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
          @changeFilter="changeFilter"
        />
      </template>
    </GeneralFilter>
    <div>
      <LabelsTree
        @onRightClick="handleRightClick"
        @loadTree="val => loadTree(val)"
        @resetFilter="onFilterReset"
        @onRemove="onRemoveLabel"
      />
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
      @onRemove="onRemoveLabel"
      @onEdit="editLabel"
      @showTasks="showTasks"
      @createLabel="(val) => createLabelFromTree(val)"
    />
    <LabelCreationModal />
    <LabelEditionModal />
    <TasksModal />
    <ConfirmDeleteModal
      type="label"
      @confirmDelete="removeLabel"
    />
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
import TasksModal from '@/pages/labels/parts/modals/tasks/TasksModal.vue'
import {
  $visibility,
  labelsFilters,
  toggleVisibility,
} from '@/pages/labels/parts/labels-filter/labels-filter.model'
import { deleteLabels, loadTree, loadTreeLight } from '@/pages/labels/labels-page.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import { searchFieldsData } from '@/pages/labels/constants'
import { RightClickParams } from '@/pages/labels/types'
import { loadModalToEdit } from '@/pages/labels/parts/modals/label-edition/label-edition.modal'
import { loadModal } from '@/pages/labels/parts/modals/tasks/tasks.model'
import { createLabelFromTree } from '@/pages/labels/parts/modals/label-creation/label-creation.model'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'

export default Vue.extend({
  components: {
    PageHeader,
    GeneralFilter,
    LabelsFilter,
    LabelsTree,
    ContextMenu,
    LabelCreationModal,
    LabelEditionModal,
    TasksModal,
    ConfirmDeleteModal,
  },
  effector: {
    $visibility,
  },
  data() {
    return {
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
    changeFilter: labelsFilters.methods.changeFilter,
    resetFilters: labelsFilters.methods.resetFilters,
    applyFilters: labelsFilters.methods.applyFilters,
    loadTree,
    toggleVisibility,
    createLabelFromTree,
    onFilterSet() {
      this.applyFilters()
    },
    onFilterReset() {
      this.resetFilters()
      reset() // search string and field
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
    onRemoveLabel(ids: number[]) {
      loadConfirmDeleteModal(ids)
    },
    removeLabel(ids: number[]) {
      deleteLabels(ids)
    },
    showTasks(id: number) {
      loadModal(id)
    },
    editLabel(id: number) {
      loadModalToEdit(id)
    },
  },
  mounted() {
    loadTreeLight()
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
