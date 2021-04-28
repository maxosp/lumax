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
import { ApplicationType } from '@/pages/applications/types'

export default Vue.extend({
  name: 'Actions',
  components: {
    Icon,
    SelectMenu,
    SelectItem,
  },
  props: {
    applicationId: { type: Number, required: true },
    taskId: { type: Number, required: true },
    selectedApplications: {
      type: Array as PropType<ApplicationType[]>,
      required: true,
    },
  },
  data: () => ({
    isOpen: false,
    popoverPlacement: 'left-start',
    popoverClass: 'actions__popover_start',
  }),
  computed: {
    items(): DropdownItem[] {
      return [
        { name: 'preview', title: 'Предпросмотр' },
        { name: 'edit', title: 'Редактировать' },
        { name: 'accept', title: 'Принять' },
        { name: 'send-for-moderation', title: 'Отправить на доработку' },
        { name: 'assign-to-moderator', title: 'Назначить заявку модератору' },
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
      const selectedApplicationsIds = this.selectedApplications.length
        ? this.selectedApplications.map((el) => el.application)
        : [this.applicationId]
      const selectedTasksIds = this.selectedApplications.length
        ? this.selectedApplications.map((el) => el.task)
        : [this.taskId]
      switch (item.name) {
        case 'preview':
          this.$emit('showPreview', selectedApplicationsIds, selectedTasksIds)
          break
        case 'edit':
          this.$emit('onEdit', selectedApplicationsIds, selectedTasksIds)
          break
        case 'accept':
          this.$emit('onAccept', selectedApplicationsIds)
          break
        case 'send-for-moderation':
          this.$emit('onSendToRevision', selectedApplicationsIds)
          break
        case 'assign-to-moderator':
          this.$emit('onAssignToModerator', selectedApplicationsIds)
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
