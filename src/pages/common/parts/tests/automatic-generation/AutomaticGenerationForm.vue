<template>
  <div>
    <DifficultyDropdown class="field" @setItem="val => changeDifficulty(val)" />
    <BaseSwitch
      class="switch field"
      :checked="$prerequisites"
      @change="togglePrerequisites"
    >
      <p>Включить пререквизиты</p>
    </BaseSwitch>
    <ThemesDropdown 
      class="type-dropdown"
      :disabled="!$subject || !$studyYear"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import DifficultyDropdown from '@/pages/common/dropdowns/testing/difficulty-dropdown/DifficultyDropdown.vue'
import ThemesDropdown from '@/pages/common/parts/tests/automatic-generation/parts/themes-dropdown/ThemesDropdown.vue'

import {
  togglePrerequisites,
  $prerequisites,
  changeDifficulty,
  $difficulty,
} from '@/pages/common/parts/tests/automatic-generation/automatic-generation-form.model'

import { $subject, $studyYear } from '@/pages/testing/tests/create/test-create-page.model'

export default Vue.extend({
  name: 'AutomaticGenerationForm',
  components: {
    BaseSwitch,
    DifficultyDropdown,
    ThemesDropdown,
  },
  effector: {
    $prerequisites,
    $difficulty,
    $subject,
    $studyYear,
  },
  methods: {
    changeDifficulty,
    togglePrerequisites,
  },
})
</script>

<style scoped>
.field {
  margin-bottom: 20px;
}
.switch {
  display: flex;
  margin-top: 0px;
}
</style>