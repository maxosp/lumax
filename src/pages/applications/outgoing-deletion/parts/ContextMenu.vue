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
    selected: { type: Array as PropType<number[]>, required: true },
    type: { type: String as PropType<'study_year' | 'olympiad_tag'>, required: true },
    subjectId: { type: [Number, null] as PropType<number | null> },
    classId: { type: [Number, null] as PropType<number | null> },
  },
  computed: {
    items(): DropdownItem[] {
      if (this.selected.length > 1) {
        return [{ name: 'cancel', title: 'Отменить заявки' }]
      }
      return [
        { name: 'open', title: 'Открыть' },
        { name: 'see-comment', title: 'Посмотреть комментарий' },
        { name: 'cancel', title: 'Отменить заявку' },
      ]
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      const ids = this.selected.length ? this.selected : this.id
      switch (item.name) {
        case 'cancel':
          this.$emit('onCancel', ids)
          break
        case 'open':
          this.$emit('onOpen', ids)
          break
        case 'see-comment':
          this.$emit('onSeeComment', ids)
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
