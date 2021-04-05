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
    type: { type: String as PropType<'theme' | 'labels'>, required: true },
    subjectId: { type: [Number, null] as PropType<number | null> },
    classId: { type: [Number, null] as PropType<number | null> },
    themeId: { type: [Number, null] as PropType<number | null> },
  },
  computed: {
    items(): DropdownItem[] {
      if (this.type === 'theme') {
        return [{ name: 'create', title: 'Создать метку' }]
      }
      return [
        { name: 'edit', title: 'Редактировать' },
        { name: 'delete', title: 'Удалить' },
        { name: 'show-tasks', title: 'Показать задания' },
      ]
    },
  },
  methods: {
    handleAction(item: SelectItemI) {
      switch (item.name) {
        case 'create':
          this.$emit('createLabel', {
            class_id: this.$props.classId,
            subject_id: this.$props.subjectId,
            theme_id: this.$props.themeId,
          })
          break
        case 'edit':
          this.$emit('onEdit', this.id)
          break
        case 'delete':
          this.$emit('onRemove', [this.id])
          break
        case 'show-tasks':
          this.$emit('showTasks', this.id)
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
