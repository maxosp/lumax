<template>
  <Card class="header">
    <div class="left">
      <p class="title"> {{ $isPrerequisite ? 'Создание пререквизита' : 'Создание темы' }} </p>
    </div>
    <div class="right">
      <BaseSwitch
        class="switch"
        :checked="$isPrerequisite"
        @change="toggleIsPrerequisite"
      >
        <p> Является пререквизитом </p>
      </BaseSwitch>
      <BaseButton
        class="btn"
        yellow
        @click="save"
      >
        Сохранить
      </BaseButton>
      <BaseButton
        class="btn"
        yellow
      >
        Сохранить и вернуться к списку
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
  $isPrerequisite,
  toggleIsPrerequisite,
  save,
} from '@/pages/theme-creation/theme-creation-page.model'

export default Vue.extend({
  components: {
    Card,
    BaseSwitch,
    BaseButton,
  },
  effector: {
    $isPrerequisite,
  },
  methods: {
    toggleIsPrerequisite,
    save,
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
