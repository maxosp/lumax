<template>
  <div class="color-picker" @click.stop="">
    <div
      class="color"
      :style="{background: $props.color}"
      @mousedown.stop="opened = !opened"
    />
    <div
      v-click-outside="close"
      v-if="opened"
      class="box"
    >
      <Picker v-model="colors" @input="change" />
    </div>
  </div>
</template>

<style>
.vc-chrome {
  box-shadow: none !important;
}

.vc-chrome-body {
  padding-bottom: 0px !important;
}
</style>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Chrome } from 'vue-color'

export default Vue.extend({
  name: `ColorPicker`,
  components: {
    Picker: Chrome,
  },
  props: {
    color: {
      type: String as PropType<string>,
      default: '#eee',
    },
  },
  data: () => ({
    opened: false,
    colors: {
      hex: '#ffffff',
    },
  }),
  methods: {
    close() {
      this.opened = false
    },
    change(data: any) {
      this.$emit('change', data.hex)
    },
  },
})
</script>

<style scoped>
.box {
  position: absolute;
  top: 50%;
  left: calc(100% + 20px);
  z-index: 2;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%);
  border-radius: 7px;
}
.color-picker,
.color {
  border-radius: 50%;
}
.color-picker {
  width: 30px;
  height: 30px;
  cursor: pointer;
  padding: 4px;
  border: 1px solid var(--c-grey-6);
  position: relative;
}
.color {
  width: 100%;
  height: 100%;
}
</style>
