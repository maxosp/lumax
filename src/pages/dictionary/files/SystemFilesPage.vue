<template>
  <div class="files-page">
    <PageHeader />
    <GeneralFilter
      :search-fields="searchFields"
      @handleFilterVisibility="toggleVisibility(!$visibility)"
      @setFilter="onFilterSet"
      @resetFilter="onFilterReset"
      @changeFilter="changeFilter"
    >
      <template #filter>
        <FilesFilter
          :visible="$visibility"
          @setFilter="onFilterSet"
          @resetFilter="onFilterReset"
          @changeFilter="changeFilter"
        />
      </template>
    </GeneralFilter>
    <LoaderBig v-if="$isLoading" />
    <div>
      <FilesTree
        v-if="!$isLoading"
        :show-paste="$elementToCopy.id !== -1"
        @onRightClick="handleRightClick"
        @onRemove="handleRemove"
        @onCreate="handleCreateFolder"
        @loadTree="val => loadTree(val)"
        @resetFilter="onFilterReset"
        @onUpload="handleUploadFile"
        @onRename="handleRename"
        @onCopy="handleCopy"
        @onPaste="handlePaste"
      />
    </div>
    <ContextMenu
      v-if="showContextMenu"
      :id="clickedRowId"
      :key="clickedRowId"
      :style="contextMenuStyles"
      :is-folder="isFolder"
      :type="contextMenuType"
      :show-paste="$elementToCopy.id !== -1"
      class="context-menu"
      @onOutsideClick="hideContextMenu"
      @onRemove="handleRemove"
      @onCreate="handleCreateFolder"
      @onUpload="handleUploadFile"
      @onRename="handleRename"
      @onCopy="handleCopy"
      @onPaste="handlePaste"
    />
    <ConfirmDeleteModal
      :type="elementType"
      @confirmDelete="handleConfirmDelete"
    />
    <CreatingFolderModal />
    <UpdateElementModal :element-type="elementType" />
    <input
      id="fileInput"
      type="file"
      class="invisible"
      @input="handleFileUpload($event)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageHeader from '@/pages/dictionary/files/parts/header/PageHeader.vue'
import GeneralFilter from '@/pages/common/general-filter/GeneralFilter.vue'
import { searchFieldsData } from '@/pages/dictionary/files/constants'
import {
  $visibility,
  filesFilters,
  toggleVisibility,
} from '@/pages/dictionary/files/parts/filter/filter.model'
import { reset } from '@/pages/common/general-filter/general-filter.model'
import FilesFilter from '@/pages/dictionary/files/parts/filter/FilesFilter.vue'
import FilesTree from '@/pages/dictionary/files/parts/tree/FilesTree.vue'
import {
  $folderId,
  $isLoading,
  deleteSelectedFileFx,
  deleteSelectedFolderFx,
  loadTree,
  loadTreeLight,
  setElementToCopy,
  setFolderId,
  uploadFile,
  $elementToCopy,
  pasteFile,
  pasteFolder,
} from '@/pages/dictionary/files/system-files-page.model'
import LoaderBig from '@/pages/common/parts/internal-loader-blocks/BigLoader.vue'
import { RightClickParams } from '@/pages/common/types'
import ContextMenu from '@/pages/dictionary/files/parts/tree/parts/ContextMenu.vue'
import ConfirmDeleteModal from '@/pages/common/modals/confirm-delete/ConfirmDeleteModal.vue'
import { loadConfirmDeleteModal } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import CreatingFolderModal from '@/pages/common/modals/system-files/create-folder/CreateFolder.vue'
import { loadFolder } from '@/pages/common/modals/system-files/create-folder/create-folder.model'
import UpdateElementModal from '@/pages/common/modals/system-files/update-element/UpdateElementModal.vue'
import {
  loadFolder as loadFolderToUpdate,
  loadFile,
  setElementType,
} from '@/pages/common/modals/system-files/update-element/update-element.model'

export default Vue.extend({
  name: 'SystemFilesPage',
  components: {
    PageHeader,
    GeneralFilter,
    FilesFilter,
    FilesTree,
    LoaderBig,
    ContextMenu,
    ConfirmDeleteModal,
    CreatingFolderModal,
    UpdateElementModal,
  },
  data: () => ({
    searchFields: searchFieldsData,
    clickedRowId: 0,
    showContextMenu: false,
    contextMenuType: 'table_theme',
    contextMenuStyles: { top: '0', left: '0' },
    isFolder: false,
    elementType: 'folder',
  }),
  effector: {
    $visibility,
    $isLoading,
    $folderId,
    $elementToCopy,
  },
  methods: {
    changeFilter: filesFilters.methods.changeFilter,
    resetFilters: filesFilters.methods.resetFilters,
    applyFilters: filesFilters.methods.applyFilters,
    toggleVisibility,
    reset,
    loadTree,
    loadFolder,
    onFilterSet() {
      this.applyFilters()
    },
    onFilterReset() {
      this.resetFilters()
      reset() // search string and field
    },
    handleRightClick({ data, event, type = 'table_theme' }: RightClickParams) {
      event.preventDefault()
      const { scrollTop } = document.querySelector('#app') || { scrollTop: 0 }
      this.isFolder = data.isFolder
      this.clickedRowId = data.id
      this.showContextMenu = true
      this.contextMenuType = type
      this.contextMenuStyles = { top: `${event.y + scrollTop}px`, left: `${event.x + 120}px` }
    },
    hideContextMenu() {
      this.showContextMenu = false
    },
    setDeleteModalType(val: string) {
      this.elementType = val
    },
    handleRemove(val: { id: number[]; type: string }) {
      this.setDeleteModalType(val.type)
      loadConfirmDeleteModal(val.id)
    },
    handleConfirmDelete(ids: number[], type: string) {
      type === 'folder' ? deleteSelectedFolderFx(ids[0]) : deleteSelectedFileFx(ids[0])
    },
    handleCreateFolder(val: number) {
      loadFolder(val)
    },
    handleUploadFile(val: number) {
      setFolderId(val)
      const fakeInput = document.getElementById('fileInput')
      fakeInput!.click()
    },
    handleFileUpload() {
      const input = document.querySelector('#fileInput')
      const { files } = input as HTMLInputElement
      uploadFile({ files: files!, folderID: this.$folderId })
    },
    handleRename(val: { id: number; type: string }) {
      this.setDeleteModalType(val.type)
      setElementType(val.type)
      val.type === 'folder' ? loadFolderToUpdate(val.id) : loadFile(val.id)
    },
    handleCopy(val: { id: number; type: string }) {
      setElementToCopy(val)
    },
    handlePaste(val: { id: number; type: string }) {
      this.$elementToCopy.type === 'folder' ? pasteFolder(val.id) : pasteFile(val.id)
    },
  },
  mounted() {
    loadTreeLight()
  },
  destroyed() {
    this.resetFilters()
  },
})
</script>

<style scoped>
.context-menu {
  position: absolute;
  top: 0;
  left: 0;
}
.invisible {
  display: none;
}
</style>
