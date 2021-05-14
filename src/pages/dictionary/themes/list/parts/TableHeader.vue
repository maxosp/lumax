<template>
  <div class="header">
    <div class="left">
      <span> {{ total | formatThemesTitle }}</span>
      <Divider
        v-if="selectedRows.length"
        vertical
        class="divider"
      />
      <span
        v-if="selectedRows && selectedRows.length === 1"
        class="--basic"
        @click="$emit('onEdit', selectedRows[0])"
      >
        Редактировать
      </span>
      <span
        v-if="selectedRows.length"
        class="--red"
        @click="handleRemove"
      >
        Удалить
      </span>
      <span
        v-if="selectedRows.length"
        class="text --basic"
        @click="$emit('onRemoveSelection')"
      >
        Снять выделение
      </span>
    </div>
    <BaseSwitch
      :checked="$treeView"
      @change="toggleTreeView"
    >
      <p>Дерево</p>
    </BaseSwitch>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import Divider from '@/ui/divider/Divider.vue'
import { themesPageParams } from '@/pages/dictionary/themes/list/themes-page.model'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    BaseSwitch,
    Divider,
  },
  effector: {
    $treeView: themesPageParams.store.treeView,
  },
  props: {
    total: { type: Number, required: true },
    selectedRows: { type: Array as PropType<number[]> },
  },
  methods: {
    toggleTreeView: themesPageParams.methods.toggleTreeView,
    handleRemove() {
      this.$emit('onRemove', this.selectedRows)
    },
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background-color: #fff;
  color: var(--base-text-primary);
  font-size: 16px;
  line-height: 16px;
  border-bottom: 1px solid var(--c-grey-9);
}
.left {
  @mixin flex-row-central;
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
