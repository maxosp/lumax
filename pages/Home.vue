<template>
  <div class="container">
    <div class="search-block">
      <input type="text" class="search-input" placeholder="Поиск по названию">
      <AppButton customClasses="search-button" isBorder>Найти</AppButton>
    </div>
    <div class="slider-block">
      <AppSlider :slides="slides" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      slides: [
        'alita',
        'avengers',
        'captain-marvel',
        'iron-man',
        'stranger-things'
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  @include flex-middle;
  flex-direction: column;
  background-color: $layout-background;
  border-radius: 15px;
  color: #fff;
  padding: 45px $column-width;
}

.search-block {
  @include flex-row;
  max-height: 43px;
}

.search-input {
  border: none;
  border-radius: 15px 15px 15px 5px;
  outline: none;

  width: 485px;
  margin-right: 20px;
  padding: 5px;
  padding-left: 50px;

  font-family: 'Panton Light Italic';
  font-size: 18px;
  font-weight: 600;

  background-image: url('~assets/images/search.png');
  background-size: 34px 33px;
  background-position: 5px;
  background-repeat: no-repeat;
}

.search-button {
  @include flex-middle;
  border-radius: 15px 15px 15px 5px;
  color: #fff;
  text-transform: none;
  width: 160px;
}

.slider-block {
  width: 100%;
}
</style>
