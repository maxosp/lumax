<template>
  <Card class="header">
    <div class="left">
      <p class="title"> {{ title }} </p>
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
        @click="$emit('save')"
      >
        Сохранить
      </BaseButton>
      <BaseButton
        class="btn"
        yellow
        @click="$emit('saveWithRedirect')"
      >
        Сохранить и вернуться к списку
      </BaseButton>
    </div>
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Card from '@/ui/card/Card.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  $isPrerequisite,
  toggleIsPrerequisite,
} from '@/pages/dictionary/themes/create/parts/header/header.model'

export default Vue.extend({
  components: {
    Card,
    BaseSwitch,
    BaseButton,
  },
  effector: {
    $isPrerequisite,
  },
  props: {
    title: { type: String as PropType<string> },
  },
  methods: {
    toggleIsPrerequisite,
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
