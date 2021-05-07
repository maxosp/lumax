<template>
  <MenuWrap
    v-click-outside="closeMenu"
    value
    class="actions"
    menu-width="100%"
  >
    <template #menu>
      <SelectMenu>
        <slot
          v-for="item in items"
          v-bind="{item, handleAction, closeMenu}"
          name="item"
        >
          <SelectItem
            :key="item.name"
            :active="false"
            class="action-item"
            @click="() => {
              handleAction(item)
              closeMenu()
            }"
          >
            {{ item.title }}
          </SelectItem>
        </slot>
      </SelectMenu>
    </template>
  </MenuWrap>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import ClickOutside from '@/features/directives/click-outside'
import { DropdownItem } from '@/pages/common/types'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ContextMenu',
  components: {
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    id: { type: Number, required: true },
    isFolder: { type: Boolean as PropType<boolean> },
    showPaste: { type: Boolean },
  },
  computed: {
    items(): DropdownItem[] {
      if (this.isFolder) {
        const res = [
          { name: 'upload', title: 'Загрузить файл' },
          { name: 'create', title: 'Создать новую папку' },
          { name: 'rename', title: 'Переименовать' },
          { name: 'copy', title: 'Копировать' },
          { name: 'delete', title: 'Удалить' },
        ]
        if (this.showPaste) res.push({ name: 'paste', title: 'Вставить' })
        return res
      }
      return [
        { name: 'rename', title: 'Переименовать' },
        { name: 'copy', title: 'Копировать' },
        { name: 'delete', title: 'Удалить' },
      ]
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      const type = this.isFolder ? 'folder' : 'file'
      const map = {
        upload: () => this.$emit('onUpload', this.id),
        create: () => this.$emit('onCreate', this.id),
        delete: () => this.$emit('onRemove', { id: [this.id], type }),
        rename: () => this.$emit('onRename', { id: this.id, type }),
        copy: () => this.$emit('onCopy', { id: this.id, type }),
        paste: () => this.$emit('onPaste', { id: this.id, type }),
      }
      map[item.name] ? map[item.name]() : undefined
    },
    closeMenu() {
      this.$emit('onOutsideClick')
    },
  },
})
</script>

<style scoped>
.actions /deep/ .menu-wrap {
  left: 0 !important;
  min-width: 240px;
}
.actions-activator {
  cursor: pointer;
}
.action-item {
  &:hover {
    background-color: var(--c-yellow-0);
  }
}
</style>
