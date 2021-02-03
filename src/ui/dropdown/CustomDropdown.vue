<template>
  <MenuWrap
    v-model="isOpen"
    menu-width="100%"
    position-offset="-10px"
    class="custom-dropdown"
  >
    <template #activator>
      <div
        class="select-activator"
        @click="onActivatorClick"
      >
        {{ placeholder }}
        <Icon
          class="chevron-icon"
          :class="{open: isOpen}"
          type="chevron-bottom"
          size="16"
        />
      </div>
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
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'CustomDropdown',
  components: {
    MenuWrap,
    SelectMenu,
    Icon,
  },
  props: {
    placeholder: { type: String as PropType<string>, required: true },
  },
  data: () => ({
    isOpen: false,
  }),

  computed: {},

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

<style scoped>
* {
  --icon-color: var(--c-accent);
}
.custom-dropdown /deep/ .select-menu {
  width: 188px;
  border-radius: 10px;
  box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.17);
  background-color: #ffffff;
}
.custom-dropdown /deep/ .menu-wrap.open {
  transform: translate3d(0, 100%, 0px) !important;
  left: 0 !important;
}
.select-activator {
  display: flex;
  align-items: center;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
}
.chevron-icon {
  fill: var(--icon-color);
  transform-origin: center;
  transition: transform var(--base-animation);
  margin-left: 10px;
  &.open {
    transform: rotate(180deg);
  }

  & >>> use {
    fill: var(--icon-color) !important;
  }
}
</style>



