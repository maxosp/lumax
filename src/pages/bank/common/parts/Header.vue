<template>
  <div class='header'>
    <div class='title'>
      <BaseButton
        class="back-btn"
        yellow
        @click="goBack(getWishedRouter)"
      >
        <Icon
          type='back'
          size='20'
          class='icon-back'
        />
      </BaseButton>
      <span>{{ title }}</span>
    </div>
    <div class='buttons'>
      <BaseButton
        class="btn"
        yellow
        :disabled="$props.disabled"
        @click="$emit('saveAndBackToList')"
      >
        Сохранить и вернуться к списку
      </BaseButton>
      <BaseButton
        class="btn"
        yellow
        :disabled="$props.disabled"
        @click="$emit('save')"
      >
        Сохранить
      </BaseButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { goBack } from '@/features/navigation'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'

export default Vue.extend({
  name: 'TaskHeader',
  components: {
    Icon,
    BaseButton,
  },
  props: {
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: true },
  },
  computed: {
    getWishedRouter() {
      switch (this.$route.name) {
        case 'test-tasks-edit':
          return { name: 'test-tasks-list' }
        case 'olympiad-tasks-edit':
          return { name: 'olympiad-tasks-list' }
        case 'lesson-tasks-edit':
          return { name: 'lesson-tasks-list' }
        default:
          return { name: 'test-tasks-list' }
      }
    },
  },
  methods: {
    goBack,
  },
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}
.title {
  display: flex;
  align-items: center;
  color: var(--base-text-primary);
  font-weight: bold;
  font-size: 20px;
  line-height: 18px;
}
.back-btn {
  margin-right: 20px;
}
.btn + .btn {
  margin-left: 20px;
}
.icon-back {
  fill: #fff;
  stroke: #fff;
}
.buttons {
  display: flex;
}
</style>
