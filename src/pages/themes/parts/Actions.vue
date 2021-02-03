<template>
  <div>
    {{ $props.rowData.id }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Actions',
  props: {
    rowData: { type: Object, required: true },
    rowIndex: { type: Object, required: true },
    rowField: { type: Object, required: true },
  },
  mounted() {
    console.log(this.$props.rowData)
    console.log(this.$props.rowIndex)
    console.log(this.$props.rowField)
  },
})
</script>

<style scoped></style>
