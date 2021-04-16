<template>
  <div class="final-text-form">
    <div class="field">
      <span class="label">Итоговый текст</span>
      <div
        v-for="(input, id) in $finalTextDropdowns"
        :key="id"
        class="final-text-item"
      >
        <div class="final-text-select">
          <BaseInput
            type="number"
            :value="input.score_min"
            placeholder="Результат от"
            :class="{ input: true }"     
            @input="(value) => setInputValue(id, 'score_min', value)"
          />
          <BaseInput
            type="number"
            :value="input.score_max"
            placeholder="Результат до"
            :class="{ input: true }"   
            @input="(value) => setInputValue(id, 'score_max', value)"
          />
          <div
            v-if="addBtnActive(input, id)"
            class="icon-btn"
            @click="addItem"
          >
            <Icon
              class="icon-plus"
              type="plus"
              size="16"
            />
          </div>
          <div
            v-else
            class="icon-btn transparent"
            @click="removeItem({ id: input.id })"
          >
            <Icon
              class="icon-close"
              type="close"
              size="8"
            />
          </div>
        </div>
        <Wysiwyg
          :value="input.text"
          placeholder="Введите итоговый текст"
          @input="setText(id, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseInput from '@/ui/input/BaseInput.vue'
import Icon from '@/ui/icon/Icon.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  setInput,
  $finalTextDropdowns,
} from '@/pages/common/parts/tests/parts/final-text-form/final-text-form.model'
import { FinalTextRelated } from '@/features/api/test/types'

export default Vue.extend({
  name: 'FinalTextForm',
  components: {
    BaseInput,
    Icon,
    Wysiwyg,
  },
  effector: {
    setInput,
    $finalTextDropdowns,
  },
  methods: {
    addBtnActive(input: FinalTextRelated, id: number) {
      return (
        input.score_min !== null &&
        input.score_max !== null &&
        id === this.$finalTextDropdowns.length - 1
      )
    },
    setInputValue(id: number, field: string, value: number) {
      const dropdowns = this.$finalTextDropdowns.map((input: FinalTextRelated) => {
        if (input.id === id) {
          return {
            id: input.id,
            score_min: field === 'score_min' ? Number(value) : input.score_min,
            score_max: field === 'score_max' ? Number(value) : input.score_max,
            text: input.text,
          }
        }
        return input
      })
      setInput(dropdowns)
    },
    setText(id: number, value: string) {
      const dropdowns = this.$finalTextDropdowns.map((input: FinalTextRelated) => {
        if (input.id === id) {
          return {
            id: input.id,
            score_min: input.score_min,
            score_max: input.score_max,
            text: value,
          }
        }
        return input
      })
      setInput(dropdowns)
    },
    addItem() {
      setInput([
        ...this.$finalTextDropdowns,
        {
          id: this.$finalTextDropdowns.length,
          score_min: null,
          score_max: null,
          text: '',
        },
      ])
    },
    removeItem(id: number) {
      const dropdowns = this.$finalTextDropdowns.filter(
        (input: FinalTextRelated) => input.id !== id
      )
      setInput(dropdowns)
    },
  },
})
</script>

<style scoped>
.final-text-form {
  position: relative;
  display: flex;
  flex-direction: column;
}

.final-text-item + .final-text-item {
  margin-top: 20px;
}

.left-border {
  position: absolute;
  left: -30px;
  width: 4px;
  height: 100%;
  background-color: var(--c-yellow-1);
}

.final-text-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  & + .correct-answer-input {
    margin-top: 10px;
  }
}

.input {
  flex-grow: 1;
  height: 46px;
  padding: 8px 15px;
  background: #fdfdfd;
  border: 1px solid #d5dae1;
  box-sizing: border-box;
  border-radius: 5px;
  margin-right: 20px;
}

.empty {
  background-color: var(--base-bg-color);
  color: var(--c-grey-1);
}

.icon-btn {
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

.icon-plus {
  fill: #fff;
}
.icon-close {
  fill: var(--c-grey-3);
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.label {
  color: #000;
  font-weight: 600;
  line-height: 17px;
  margin-bottom: 5px;
}
</style>
