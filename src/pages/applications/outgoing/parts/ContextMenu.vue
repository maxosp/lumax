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
    applicationId: { type: Number, required: true },
    taskId: { type: Number, required: true },
    selectedApplications: { type: Array as PropType<ApplicationType[]>, required: true },
  },
  computed: {
    items(): DropdownItem[] {
      const res = [
        { name: 'preview', title: 'Предпросмотр' },
        { name: 'edit', title: 'Редактировать' },
      ]
      if (this.$props.selectedApplications.length === 1) {
        res.push({ name: 'see-comment', title: 'Посмотреть комментарии' })
        res.push({ name: 'cancel', title: 'Отменить заявку' })
      }
      if (this.$props.selectedApplications.length > 1)
        res.push({ name: 'cancel', title: 'Отменить заявки' })
      return res
    },
  },
  methods: {
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
        case 'cancel':
          this.$emit('onCancel', selectedApplicationsIds)
          break
        case 'see-comment':
          this.$emit('onSeeComments', selectedApplicationsIds)
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
