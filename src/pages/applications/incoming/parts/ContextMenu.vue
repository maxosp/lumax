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
import { ApplicationType } from '../../types'

Vue.directive('click-outside', ClickOutside)

export default Vue.extend({
  name: 'ContextMenu',
  components: {
    MenuWrap,
    SelectMenu,
    SelectItem,
  },
  props: {
    selectedApplications: { type: Array as PropType<ApplicationType[]>, required: true },
  },
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
    handleAction(item: SelectItemI) {
      const selectedApplicationsIds = this.selectedApplications.map((el) => el.application)
      const selectedTasksIds = this.selectedApplications.map((el) => el.task)
      switch (item.name) {
        case 'preview':
          this.$emit('showPreview', selectedTasksIds)
          break
        case 'edit':
          this.$emit('onEdit', selectedTasksIds)
          break
        case 'accept':
          this.$emit('onAccept', selectedApplicationsIds)
          break
        case 'send-for-moderation':
          this.$emit('onSendForModeration', selectedApplicationsIds)
          break
        case 'assign-to-moderator':
          this.$emit('onAssignToModerator', selectedApplicationsIds)
          break
        default:
          break
      }
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
