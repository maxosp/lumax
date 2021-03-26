<template>
  <div class="show-answer-block">
    <div class="top">
      <BaseSwitch
        class="switch toggler"
        :checked="showSolutionEnabled"
        @change="val => $emit('showSolutionEnabledChanged', val)"
      >
        <p>Посмотреть решение</p>
      </BaseSwitch>
      <div
        v-if="showSolutionEnabled"
        class="field"
      >
        <span class='label'>Текст решения</span>
        <Wysiwyg :value="solutionText" @input="val => $emit('set-solution', val)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'

export default Vue.extend({
  name: 'ShowAnswerBlock',
  components: {
    BaseSwitch,
    Wysiwyg,
  },
  props: {
    showSolutionEnabled: { type: Boolean, default: false },
    solutionText: { type: String },
  },
})
</script>

<style scoped>
.field {
  margin-top: 20px;
  .label {
    color: #000;
    font-weight: 600;
    line-height: 17px;
    margin-bottom: 5px;
  }
}
</style>
