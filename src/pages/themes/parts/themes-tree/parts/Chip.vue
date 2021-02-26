<template>
  <div
    v-tooltip.right="options"
    v-if="item && item.count"
    :class="{ chip: true, primary: $props.primary }"
  >
    <Icon
      :type="$props.icon"
      class="chip-icon"
      size="12"
    />
    <span>{{ item.count }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import { ResourceChip } from '@/pages/themes/types'

export default Vue.extend({
  name: 'Chip',
  components: {
    Icon,
  },
  props: {
    icon: { type: String, required: true },
    item: { type: Object as PropType<ResourceChip>, required: true },
    primary: { type: Boolean, required: false, default: false },
  },
  computed: {
    options() {
      return {
        content: this.item.description,
      }
    },
  },
})
</script>

<style scoped>
.chip {
  padding: 4px 8px;
  font-weight: 600;
  line-height: 14px;
  border-radius: 40px;
  background-color: var(--c-grey-3);
  margin-left: 5px;
  color: #fff;
}

.primary {
  background-color: var(--c-yellow-1);
  margin-left: 15px;
}

.chip-icon {
  fill: #fff;
}

.tooltip {
  & /deep/ .tooltip {
    background-color: var(--tooltip-bg-color);
    color: #fff;
    font-weight: 600;
    line-height: 14px;
    padding: 15px;
  }
  & /deep/ .menu-wrap {
    min-width: max-content;
    width: auto;
    right: 0 !important;
    top: 200% !important;
  }
  & /deep/ .arrow {
    display: none;
  }
}
</style>
