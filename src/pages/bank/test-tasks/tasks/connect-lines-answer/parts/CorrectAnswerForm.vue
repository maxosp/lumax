<template>
  <div class="question-answers-form">
    <div class="left-border" />
    <BaseCheckbox
      option="reorder"
      class="reorder-checkbox"
      :value="$reorderEnabled"
      @change="toggleReorderEnabling"
    >
      Отключить перемешивание
    </BaseCheckbox>
    <div
      v-for="(match, idx) in $matches"
      :key="match.id"
      class="matches"
    >
      <div class="match">
        <div v-if="idx === 0" class="label">А</div>
        <Wysiwyg
          class="wysiwyg"
          :value="match.matchA"
          @input="matchA => handleMatchAChange({ id: match.id, matchA })"
        />
      </div>
      <div class="match">
        <div v-if="idx === 0" class="label">Б</div>
        <Wysiwyg
          class="wysiwyg"
          :value="match.matchB"
          @input="matchB => handleMatchBChange({ id: match.id, matchB })"
        />
      </div>
      <div
        v-if="$matches.length > 1"
        :class="{ transparent: true, 'icon-btn': true, 'first-icon': idx === 0 }"
        @click="removeMatch({ id: match.id })"
      >
        <Icon
          class="icon-close"
          type="close"
          size="8"
        />
      </div>
    </div>
    <div class="add-question" @click="addMatch">
      <BaseButton>Добавить сопоставление</BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseCheckbox from '@/ui/checkbox/BaseCheckbox.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  $matches,
  setMatches,
  $reorderEnabled,
  toggleReorderEnabling,
} from '@/pages/bank/test-tasks/tasks/connect-lines-answer/connect-lines-answer.model'
import { getRandomId } from '@/pages/bank/test-tasks/tasks/utils'

export default Vue.extend({
  name: 'CorrectAnswerForm',
  components: {
    Icon,
    Wysiwyg,
    BaseButton,
    BaseCheckbox,
  },
  effector: {
    $matches,
    $reorderEnabled,
  },
  methods: {
    toggleReorderEnabling,
    handleMatchAChange({ id, matchA }) {
      const matches = this.$matches.map((match) => (match.id === id ? { ...match, matchA } : match))
      setMatches(matches)
    },
    handleMatchBChange({ id, matchB }) {
      const matches = this.$matches.map((match) => (match.id === id ? { ...match, matchB } : match))
      setMatches(matches)
    },
    addMatch() {
      setMatches([...this.$matches, { id: getRandomId(), matchA: '', matchB: '' }])
    },
    removeMatch({ id }) {
      const matches = this.$matches.filter((match) => match.id !== id)
      setMatches(matches)
    },
  },
})
</script>

<style scoped>
.question-answers-form {
  position: relative;
  display: flex;
  flex-direction: column;
}

.left-border {
  position: absolute;
  left: -30px;
  width: 4px;
  height: 100%;
  background-color: var(--c-yellow-1);
}

.reorder-checkbox {
  margin-bottom: 20px;
}

.matches {
  display: flex;
  margin-bottom: 20px;
}

.match {
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  & + .match {
    margin-left: 20px;
  }
}

.label {
  font-weight: 600;
  line-height: 17px;
  margin-bottom: 5px;
}

.first-icon {
  margin-top: 20px;
}

.icon-btn {
  max-width: 150px;
  margin-left: 10px;
  cursor: pointer;
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: var(--base-text-primary);
}

.transparent {
  background-color: transparent;
}

.icon-close {
  fill: var(--c-grey-3);
}

.add-question {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
