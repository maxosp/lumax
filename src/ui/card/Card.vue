<template>
  <div class="card">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid var(--base-bg-color);
  box-sizing: border-box;
  border-radius: 10px;
  padding: 60px 90px;
  @mixin flex-center;
}
.content {
  width: 100%;
  @mixin flex-column-central;
}
</style>
