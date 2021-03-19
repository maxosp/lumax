<template>
  <div
    v-if="pagesAmount > 1"
    class="pagination"
  >
    <PaginationLeftBtn
      v-if="selectedPage !== 1"
      @go-to-prev-page="$emit('go-to-prev-page')"
    />
    <PaginationButton
      v-for="(item, index) of pagesAmount"
      :key="index"
      :index="index + 1"
      :pages="pagesAmount"
      :selected-page="selectedPage"
      @change-page="(val) => $emit('change-page', val)"
    />
    <PaginationRightBtn
      v-if="selectedPage !== pagesAmount"
      @go-to-next-page="$emit('go-to-next-page')"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import PaginationButton from '@/ui/pagination/PaginationButton.vue'
import PaginationRightBtn from '@/ui/pagination/PaginationRightBtn.vue'
import PaginationLeftBtn from '@/ui/pagination/PaginationLeftBtn.vue'

export default Vue.extend({
  components: {
    PaginationButton,
    PaginationRightBtn,
    PaginationLeftBtn,
  },
  props: {
    selectedPage: { type: Number as PropType<number> },
    count: { type: Number as PropType<number> },
  },
  computed: {
    pagesAmount() {
      if (this.count) return Math.ceil(this.count / 10)
      return 1
    },
  },
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 40px;
}

.pagination-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;

  margin-right: 10px;

  border: 2px solid var(--base-text-primary);
  border-radius: 5px;

  color: #fff;
  background-color: var(--base-text-primary);
  font-size: 14px;
  font-weight: bold;
}
.--active {
  background: var(--base-text-primary);
  color: #ffffff;
}
.--first,
.--last {
  position: relative;
  &::after {
    content: '...';
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    color: var(--base-text-primary);
  }
}
.--first {
  margin-right: 40px;
  &::after {
    left: 39px;
  }
}
.--last {
  margin-left: 40px;
  &::after {
    right: 39px;
  }
}
.pagination /deep/ .icon-pagination {
  width: 11px;
  fill: var(--base-text-primary);
}
</style>

