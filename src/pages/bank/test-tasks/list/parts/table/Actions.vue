<template>
  <MenuWrap
    v-model="isOpen"
    class="actions"
    menu-width="100%"
  >
    <template #activator>
      <Icon
        class="actions-activator"
        type="kebab-menu"
        size="24"
        @click="onActivatorClick"
      />
    </template>

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
import Icon from '@/ui/icon/Icon.vue'
import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { navigatePush } from '@/features/navigation'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import { DropdownItem } from '@/pages/common/types'
import {
  contextMethodsOneTask,
  contextMethodsManyTasks,
} from '@/pages/bank/test-tasks/list/constants'

export default Vue.extend({
  name: 'Actions',
  components: {
    Icon,
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    id: { type: Number, required: true },
    selected: { type: Array as PropType<number[]>, required: true },
    light: { type: Boolean, default: false },
    isTheme: { type: Boolean },
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    items(): DropdownItem[] {
      if (this.light && this.isTheme)
        return [
          { name: 'create-theme', title: 'Создать тему' },
          { name: 'create-task', title: 'Создать задание' },
          { name: 'edit-theme', title: 'Редактировать' },
          { name: 'delete-theme', title: 'Удалить' },
        ]
      if (this.light && !this.isTheme)
        return [
          { name: 'edit-task', title: 'Редактировать' },
          { name: 'preview', title: 'Предпросмотр' },
          { name: 'delete-task', title: 'Удалить' },
        ]
      return this.$props.selected.length ? contextMethodsManyTasks : contextMethodsOneTask
    },
  },
  methods: {
    onActivatorClick() {
      this.isOpen = !this.isOpen
    },
    handleAction(item: SelectItemI) {
      switch (item.name) {
        case 'edit':
          navigatePush({ name: 'themes-edit', params: { id: this.$props.id } })
          break
        case 'delete-theme':
          this.$emit('onRemoveTheme', [this.$props.id])
          break
        case 'delete-task':
          this.$emit('onRemoveTask', [this.$props.id])
          break
        case 'delete':
          this.$emit('onRemove', this.$props.id)
          break
        case 'delete_all':
          this.$emit('onRemove', this.$props.selected)
          break
        case 'send_to_check':
          this.$emit('onCheck', this.$props.id)
          break
        case 'send_to_check_all':
          this.$emit('onCheck', this.$props.selected)
          break
        case 'public':
          this.$emit('onPublish', this.$props.id)
          break
        case 'public_all':
          this.$emit('onPublish', this.$props.selected)
          break
        case 'preview':
          this.$emit('onPreview', this.$props.id)
          break
        case 'create-theme':
          navigatePush({
            name: 'themes-create',
            params: {
              subject: `${this.$props.subject}`,
              studyYear: `${this.$props.studyYear}`,
              theme: `${this.$props.theme}`,
            },
          })
          break
        default:
          break
      }
    },
    closeMenu() {
      this.isOpen = false
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
