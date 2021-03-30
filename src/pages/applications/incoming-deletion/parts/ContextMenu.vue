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
import { ApplicationType } from '@/pages/applications/types'

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
      if (this.selectedApplications.length > 1) {
        return [
          { name: 'accept', title: 'Принять' },
          { name: 'reject', title: 'Отклонить' },
        ]
      }
      return [
        { name: 'accept', title: 'Принять' },
        { name: 'reject', title: 'Отклонить' },
        { name: 'open', title: 'Открыть' },
        { name: 'see-comment', title: 'Посмотреть комментарии' },
      ]
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      const selectedApplicationsIds = this.selectedApplications.map((el) => el.application)
      switch (item.name) {
        case 'accept':
          this.$emit('onAccept', selectedApplicationsIds)
          break
        case 'reject':
          this.$emit('onReject', selectedApplicationsIds)
          break
        case 'open':
          this.$emit('onOpen', this.selectedApplications[0])
          break
        case 'see-comment':
          this.$emit('onSeeComment', selectedApplicationsIds[0])
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
