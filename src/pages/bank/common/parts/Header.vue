<template>
  <div class='header'>
    <div class="top">
      <div class='title'>
        <BaseButton
          class="back-btn"
          yellow
          @click="goBack(getWishedRoute)"
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
        <BaseSwitch
          v-if="statusController"
          class="switcher"
          :checked="isPreview"
          @change="val => $emit('toggle', val)"
        >
          <p>Предпросмотр</p>
        </BaseSwitch>
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
    <Divider />
    <StatusController
      v-if="statusController"
      :from-page="fromPage"
      :is-preview="isPreview"
      :task-type="taskType"
      @onAccept="$emit('onAccept')"
      @onSendToRevision="$emit('onSendToRevision')"
      @onSeeComments="$emit('onSeeComments')"
      @onSendToReview="$emit('onSendToReview')"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { goBack } from '@/features/navigation'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import Divider from '@/ui/divider/Divider.vue'
import StatusController from '@/pages/common/parts/status-controller/StatusContoller.vue'

export default Vue.extend({
  name: 'TaskHeader',
  components: {
    Icon,
    BaseButton,
    BaseSwitch,
    Divider,
    StatusController,
  },
  props: {
    title: { type: String as PropType<string>, default: '' },
    disabled: { type: Boolean as PropType<boolean>, default: true },
    isPreview: { type: Boolean as PropType<boolean> },
    fromPage: { type: String as PropType<string> },
    taskType: { type: String as PropType<string> },
    statusController: { type: Boolean as PropType<boolean>, default: false },
  },
  computed: {
    getWishedRoute() {
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
  @mixin flex-column-central;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
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
.switcher {
  @mixin flex-center;
  margin-right: 20px;
}
.status .--bold {
  font-weight: 600;
}
</style>
