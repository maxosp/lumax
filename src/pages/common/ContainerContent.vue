<template>
  <div class="container-content">
    <slot />
  </div>
</template>

<style scoped>
.container-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 0 80px;
}
</style>


