<template>
  <Card class="header">
    <div class="left">
      <p class="title">Создание предмета</p>
    </div>
    <div class="right">
      <BaseSwitch
        class="switch"
        :checked="$isModatory"
        @change="toggleIsMondatory"
      >
        <p> Является обязательным </p>
      </BaseSwitch>
      <BaseButton
        class="btn"
        yellow
        @click="handleClick"
      >
        Сохранить и вернуться к списку
      </BaseButton>
      <BaseButton
        class="btn"
        yellow
        @click="save"
      >
        Сохранить
      </BaseButton>
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $isModatory,
  toggleIsMondatory,
  save,
  redirectAfterSaveChanged,
} from '@/pages/subjects/create/subjects-creation-page.model'

export default Vue.extend({
  components: {
    Card,
    BaseSwitch,
    BaseButton,
  },
  effector: { $isModatory },
  methods: {
    toggleIsMondatory,
    save,
    redirectAfterSaveChanged,
    handleClick() {
      redirectAfterSaveChanged(true)
      save()
    },
  },
})
</script>

<style scoped>
.header.card {
  width: 100%;
  height: 58px;
  padding: 0 20px;
  & ::v-deep .content {
    @mixin flex-row-central;
    justify-content: space-between;
  }
  .left {
    .title {
      font-size: 20px;
      font-weight: 700;
      line-height: 18px;
      color: var(--base-text-primary);
    }
  }
  .right {
    @mixin flex-row-central;
    .switch {
      margin-right: 30px;
      margin-top: 0px;
    }
    .btn {
      width: fit-content;
    }
    .btn:last-child {
      margin-left: 20px;
    }
  }
}
</style>
