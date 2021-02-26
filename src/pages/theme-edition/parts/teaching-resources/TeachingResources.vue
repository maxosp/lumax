<template>
  <div class="teaching-resources">
    <p class="title"> Обучающие ресурсы </p>
    <p class="description"> Обучающие ресурсы еще не добавлены </p>
    <p class="underline"> Добавить ресурс </p>
  </div>
</template>

<style scoped>
.teaching-resources {
  margin-bottom: 30px;
  p {
    font-weight: 400;
    line-height: 17px;
    color: var(--base-text-primary);
  }
  p.title {
    font-weight: 600;
    margin-bottom: 16px;
  }
  p.underline {
    width: fit-content;
    font-weight: 600;
    margin-top: 20px;
    @mixin underline-text;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
