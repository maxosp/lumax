<template>
  <div class="add-hints-block">
    <div
      v-for="(hint, index) in $hintsList"
      :key="hint.id"
      class="hint-block"
    >
      <span class="label">Подсказка {{ index + 1 }} </span>
      <div class="editor-wrapper">
        <Wysiwyg :value="hint.text" @input="text => handleHintTextChanged({ id: hint.id, text})" />
        <div
          class="remove-hint"
          @click="removeHint({ id: hint.id })"
        >
          <Icon
            class="icon-close"
            type="close"
            size="8"
          />
        </div>
      </div>
      <div class="hint-price">
        <span class="label">Цена подсказки</span>
        <NumericInput :value="+hint.price" @input="price => setHintPrice({ id: hint.id, price })" />
      </div>
    </div>
    <div class="add-hint" @click="addHint">
      <BaseButton>Добавить подсказку</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import Icon from '@/ui/icon/Icon.vue'
import NumericInput from '@/ui/input/NumericInput.vue'
import {
  $hintsList,
  setHint,
} from '@/pages/common/parts/tasks/parts/add-hints-block/add-hints-block.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'

export default Vue.extend({
  components: {
    BaseButton,
    Wysiwyg,
    Icon,
    NumericInput,
  },
  effector: {
    $hintsList,
  },
  methods: {
    addHint() {
      setHint([...this.$hintsList, { id: getRandomId(), text: '', price: 1 }])
    },
    handleHintTextChanged({ id, text }: { id: number; text: string }) {
      const hints = this.$hintsList.map((hint) => (hint.id === id ? { ...hint, text } : hint))
      setHint(hints)
    },
    removeHint({ id }: { id: number }) {
      const hintsList = this.$hintsList.filter((hint) => hint.id !== id)
      setHint(hintsList)
    },
    setHintPrice({ id, price }: { id: number; price: number }) {
      const hints = this.$hintsList.map((hint) => (hint.id === id ? { ...hint, price } : hint))
      setHint(hints)
    },
  },
})
</script>

<style scoped>
.add-hints-block {
  .hint-block {
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
    .remove-hint {
      margin-left: 20px;
      fill: var(--c-grey-3);
      cursor: pointer;
    }
    .hint-price {
      width: 100%;
      .numeric-input-wrap {
        width: 95%;
      }
    }
  }
  .hint-block:not(:last-child) {
    margin-bottom: 20px;
  }
  .add-hint button {
    margin: 0 auto;
  }
}
</style>
