<template>
  <v-popover
    :open="isOpen"
    :placement="popoverPlacement"
    :popover-class="popoverClass"
    popover-inner-class=""
    @apply-hide="closeMenu"
  >
    <Icon
      class="actions-activator"
      type="kebab-menu"
      size="24"
      @click="onActivatorClick"
    />
    <template v-slot:popover>
      <SelectMenu v-if="isOpen">
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
  </v-popover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import SelectItem from '@/ui/select/parts/SelectItem.vue'
import { SelectItemI } from '@/ui/select/BaseSelect.vue'
import { DropdownItem } from '@/pages/common/types'
import { actionsSelectMenuMaxHeight, selectItemHeight } from '@/pages/common/constants'

export default Vue.extend({
  name: 'Actions',
  components: {
    Icon,
    SelectMenu,
    SelectItem,
  },
  props: {
    id: { type: Number, required: true },
    selected: { type: Array as PropType<number[]>, required: true },
    isStudyYear: { type: Boolean },
    isTheme: { type: Boolean },
    dataToCreateTag: {
      type: [Object, null] as PropType<{ class_id: number; subject_id: number } | null>,
    },
    dataToCreateLabel: {
      type: [Object, null] as PropType<{
        class_id: number
        subject_id: number
        theme: number
      } | null>,
    },
  },
  data: () => ({
    isOpen: false,
    popoverPlacement: 'left-start',
    popoverClass: 'actions__popover_start',
  }),
  computed: {
    items(): DropdownItem[] {
      if (this.isStudyYear) return [{ name: 'create', title: 'Создать тег' }]
      if (this.isTheme) return [{ name: 'create', title: 'Создать метку' }]
      if (this.selected.length > 1) {
        return [{ name: 'delete-all', title: 'Удалить выделенные задания' }]
      }
      return [
        { name: 'edit', title: 'Редактировать' },
        { name: 'duplicate', title: 'Дублировать задание' },
        { name: 'duplicate-n-times', title: 'Дублировать задание n раз' },
        { name: 'send-for-check', title: 'Отправить на проверку' },
        { name: 'preview', title: 'Предпросмотр' },
        { name: 'delete', title: 'Удалить задание' },
      ]
    },
  },
  methods: {
    onActivatorClick() {
      this.setPopoverPlacement()
      this.isOpen = !this.isOpen
    },
    setPopoverPlacement() {
      const vuetableBottomPosition = this.$parent.$el.getBoundingClientRect().bottom
      const actionsBottomPosition = this.$el.getBoundingClientRect().bottom
      const selectItemsSumHeight = this.items.length * selectItemHeight
      const selectMenuHeight =
        selectItemsSumHeight > actionsSelectMenuMaxHeight
          ? actionsSelectMenuMaxHeight
          : selectItemsSumHeight

      if (vuetableBottomPosition - actionsBottomPosition < selectMenuHeight) {
        this.popoverPlacement = 'left-end'
        this.popoverClass = 'actions__popover_end'
      }
    },
    handleAction(item: SelectItemI) {
      switch (item.name) {
        case 'edit':
          this.$emit('onEdit', this.id)
          break
        case 'duplicate':
          this.$emit('duplicate', this.id)
          break
        case 'duplicate-n-times':
          // TO DO add copy method
          break
        case 'send-for-check':
          this.$emit('sendForCheck', this.id)
          break
        case 'delete-all':
          this.$emit('onRemove', this.selected)
          break
        case 'delete':
          this.$emit('onRemove', [this.id])
          break
        case 'preview':
          this.$emit('showPreview', this.id)
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

<style>
.actions__popover {
  @mixin actions-popover;
}
</style>
