<template>
  <div class="no-data-content">
    <div>Поиск не дал результатов.</div>
    <div>Попробуйте
      <span class="reset-filters" @click="resetFilters">
        сбросить все фильтры
      </span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    resetFilters() {
      this.$emit('resetFilters')
    },
  },
}
</script>

<style scoped>
.no-data-content {
  width: 100%;
  min-height: 550px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--base-text-secondary);
  & > div + div {
    margin-top: 10px;
  }
}
.reset-filters {
  color: var(--base-text-primary);
  cursor: pointer;
  @mixin underline-text;
}
</style>
