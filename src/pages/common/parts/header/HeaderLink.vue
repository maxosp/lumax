<template>
  <router-link
    :to="{ name: routeName }"
    class="header-link"
  >
    <slot />
  </router-link>
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
  --hover-bg-color: var(--c-purple-0);
}
.header-link {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  padding: 0 20px;
  transition: background-color var(--base-animation);
  &:hover {
    background-color: var(--hover-bg-color);
  }
}
.router-link-exact-active {
  background-color: var(--hover-bg-color);
}
</style>


