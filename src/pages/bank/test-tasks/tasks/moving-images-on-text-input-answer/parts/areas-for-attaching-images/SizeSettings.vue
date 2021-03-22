<template>
  <div class="size-settings">
    <FormInput
      value="0"
      placeholder=""
      label=""
      class="input width"
    />
    <Icon
      class="relative"
      size="18px"
      type="relative"
    />
    <FormInput
      value="0"
      placeholder=""
      label=""
      class="input height"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FormInput from '@/ui/input/FormInput.vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: `SizeSettings`,
  components: {
    FormInput,
    Icon,
  },
})
</script>

<style scoped>
.size-settings {
  display: flex;
  align-items: center;
}
.input {
  width: 50px;
}
.relative {
  cursor: pointer;
  margin: 0 11px;
}
</style>
