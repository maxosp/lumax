<template>
  <div
    class="header"
    :class="{invisible: !total}"
  >
    <span>{{ total | formatTagsTitle }}</span>
    <Divider
      v-if="selectedRows.length"
      vertical
      class="divider"
    />
    <span
      v-if="selectedRows && selectedRows.length === 1"
      class="--basic"
      @click="$emit('onEdit', selectedRows)"
    >
      Редактировать
    </span>
    <span
      v-if="selectedRows.length"
      class="--red"
      @click="$emit('onRemove', selectedRows)"
    >
      Удалить
    </span>
    <span
      v-if="selectedRows && selectedRows.length === 1"
      class="--basic"
      @click="$emit('showTasks', selectedRows)"
    >
      Показать задания
    </span>
    <span
      v-if="selectedRows.length"
      class="text --basic"
      @click="$emit('onRemoveSelection')"
    >
      Снять выделение
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Divider from '@/ui/divider/Divider.vue'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    Divider,
  },
  props: {
    total: { type: Number, required: true },
    selectedRows: { type: Array as PropType<number[]> },
  },
})
</script>

<style scoped>
.invisible {
  display: none;
}

.header {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30px;
  background-color: #fff;
  color: var(--base-text-primary);
  font-size: 16px;
  line-height: 16px;
  border-bottom: 1px solid var(--c-grey-9);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  .divider {
    background-color: var(--c-grey-15);
    margin: 0 25px;
  }
  span {
    cursor: pointer;
  }
  span.--basic {
    margin-right: 25px;
  }
  span.--red {
    color: var(--c-red-1);
    margin-right: 25px;
  }
  .text.--basic {
    margin-right: 25px;
  }
}
</style>
