<template>
  <div class="header">
    <div class="title"> Системные файлы </div>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  height: 58px;
  border-radius: 3px;
  @mixin flex-row-central;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.title {
  font-size: 20px;
  line-height: 18px;
  font-weight: 700;
  color: var(--base-text-primary);
}
</style>
