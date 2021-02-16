<template>
  <MenuWrap
    v-model="isOpen"
    menu-width="100%"
    position-offset="-5px"
  >
    <template #activator>
      <DropdownActivator
        :value="value"
        :placeholder="placeholder"
        :label="label"
        :is-open="isOpen"
        :error-message="errorMessage"
        :disabled="disabled"
        :read-only-dropdown="readOnlyDropdown"
        @click="onActivatorClick"
        @clear="$emit('clear')"
        @input="(e) => $emit('input', e)"
      >
        <template #error>
          <slot name="error" />
        </template>
      </DropdownActivator>
    </template>

    <template #menu>
      <SelectMenu>
        <slot v-bind="{closeMenu}" />
      </SelectMenu>
    </template>
  </MenuWrap>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MenuWrap from '@/ui/menu/MenuWrap.vue'
import SelectMenu from '@/ui/select/parts/SelectMenu.vue'
import DropdownActivator from '@/ui/dropdown/parts/DropdownActivator.vue'

export default Vue.extend({
  name: 'BaseDropdown',
  components: {
    MenuWrap,
    DropdownActivator,
    SelectMenu,
  },
  props: {
    errorMessage: { type: String as PropType<string>, default: '' },
    value: { type: String as PropType<string>, required: true },
    placeholder: { type: String as PropType<string>, required: true },
    label: { type: String as PropType<string>, required: true },
    disabled: { type: Boolean as PropType<boolean> },
    readOnlyDropdown: { type: Boolean as PropType<boolean> },
  },
  data: () => ({
    isOpen: false,
  }),
  methods: {
    onActivatorClick() {
      this.isOpen = !this.isOpen
    },
    closeMenu() {
      this.isOpen = false
    },
  },
})
</script>
