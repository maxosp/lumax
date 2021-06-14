<template>
  <div class="container">
    <div class="socials">
      <a href="#">&#xe908;</a>
      <a href="#">&#xe905;</a>
      <a href="#">&#xe906;</a>
      <a href="#">&#xe909;</a>
    </div>
    <p>Max Osipenko 2021</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>

<style lang="scss" scoped>
.container {
  @include flex-middle;
  padding: 32px $column-width;
  justify-content: space-between
}

.socials {
  @include flex-row;
  font-size: 28px;
  font-family: 'icomoon';
  width: 14%;
  justify-content: space-between;

  a {
    color: $primary-color;
  }
}

p {
  text-transform: uppercase;
  color: $shadow-text-color;
  font-size: 18px;
}
</style>
