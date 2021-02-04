<template>
  <RouterLink
    :to="{ name: routeName }"
    class="header-link"
  >
    <slot />
  </RouterLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'HeaderLink',
  props: {
    routeName: {
      type: String as PropType<string>,
      default: '',
    },
  },
})
</script>

<style scoped>
* {
  --hover-bg-color: var(--c-yellow-1);
}
.header-link {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 12px;
  font-weight: 600;
  color: var(--base-text-primary);
  text-decoration: none;
  padding: 0 20px;
  transition: background-color var(--base-animation);
  &:hover {
    text-decoration: underline;
  }
}
.router-link-exact-active {
  background-color: var(--hover-bg-color);
}
</style>


