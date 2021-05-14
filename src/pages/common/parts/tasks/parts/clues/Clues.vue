<template>
  <div class="clues-block">
    <div
      v-for="(clue, index) in $clues"
      :key="clue.id"
      class="clue-block"
    >
      <span class="label">Подсказка {{ index + 1 }} </span>
      <div class="editor-wrapper">
        <Wysiwyg :value="clue.text" @input="text => handleClueTextChanged({ id: clue.id, text})" />
        <div
          class="remove-clue"
          @click="removeClue({ id: clue.id })"
        >
          <Icon
            class="icon-close"
            type="close"
            size="8"
          />
        </div>
      </div>
      <NumericInput
        :value="+clue.scores"
        label="Цена подсказки"
        @input="scores => setCluePrice({ id: clue.id, scores })"
      />
    </div>
    <div class="add-clue">
      <BaseButton @click="addClue">Добавить подсказку</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import Icon from '@/ui/icon/Icon.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import { $clues, setClues } from '@/pages/common/parts/tasks/parts/clues/clues.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'

export default Vue.extend({
  components: {
    BaseButton,
    Wysiwyg,
    Icon,
    NumericInput,
  },
  effector: {
    $clues,
  },
  methods: {
    addClue() {
      setClues([
        ...this.$clues,
        {
          id: getRandomId(),
          text: '',
          scores: 1,
        },
      ])
    },
    handleClueTextChanged({ id, text }: { id: number; text: string }) {
      const clues = this.$clues.map((clue) => (clue.id === id ? { ...clue, text } : clue))
      setClues(clues)
    },
    removeClue({ id }: { id: number }) {
      const cluesList = this.$clues.filter((clue) => clue.id !== id)
      setClues(cluesList)
    },
    setCluePrice({ id, scores }: { id: number; scores: number }) {
      const clues = this.$clues.map((clue) => (clue.id === id ? { ...clue, scores } : clue))
      setClues(clues)
    },
  },
})
</script>

<style scoped>
.clues-block {
  .clue-block {
    box-sizing: border-box;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-grey-4);
    .label {
      width: 100%;
      color: #000;
      font-weight: 600;
      line-height: 18px;
      margin-bottom: 7px;
    }
    .editor-wrapper {
      width: 100%;
      @mixin flex-row-central;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .wysiwyg {
      width: 95%;
    }
    .remove-clue {
      margin-left: 20px;
      fill: var(--c-grey-3);
      cursor: pointer;
    }
    .clue-price {
      width: 100%;
      .numeric-input-wrap {
        width: 95%;
      }
    }
  }
  .clue-block:not(:last-child) {
    margin-bottom: 20px;
  }
  .add-clue button {
    margin: 0 auto;
  }
}
</style>
