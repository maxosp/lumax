<template>
  <div class="teaching-resources">
    <p class="title"> Обучающие ресурсы </p>
    <p class="description"> Обучающие ресурсы еще не добавлены </p>
    <p class="underline" @click="redirectToResourceCreate"> Добавить ресурс </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  $themeTitle,
  redirectToResourceCreate,
} from '@/pages/dictionary/themes/edit/theme-edition-page.model'
import { $selectedSubject } from '@/pages/dictionary/themes/edit/parts/subjects/subjects.model'
import { $selectedClass } from '@/pages/dictionary/themes/edit/parts/class/class.model'

export default Vue.extend({
  effector: {
    $themeTitle,
    $selectedSubject,
    $selectedClass,
  },
  methods: {
    redirectToResourceCreate,
  },
})
</script>

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
