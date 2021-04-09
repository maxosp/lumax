<template>
  <div class='header'>
    <div class="top">
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
        <BaseSwitch
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
    <div class="bottom">
      <div class="status">
        <span class="--bold"> Статус задания: </span> {{ correctStatus }}
      </div>
      <div class="buttons">
        <BaseButton
          v-if="status === 'revision'"
          class="btn --grey"
          @click="$emit('onSeeComments')"
        >
          <Icon
            type="comment"
            size="20"
            class="icon"
          />
        </BaseButton>
        <BaseButton
          v-if="[ 'revision', 'new', 'archive' ].includes(status)"
          class="btn"
          @click="$emit('onRevision')"
        >
          На проверку
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { goBack } from '@/features/navigation'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import Divider from '@/ui/divider/Divider.vue'
import { mapTaskStatus } from '@/pages/dictionary/themes/list/constants'

export default Vue.extend({
  name: 'TaskHeader',
  components: {
    Icon,
    BaseButton,
    BaseSwitch,
    Divider,
  },
  props: {
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: true },
    isPreview: { type: Boolean },
    status: { type: String },
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
    correctStatus() {
      return this.status ? mapTaskStatus[this.status] : ''
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
  padding: 8px 20px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}
.top,
.bottom {
  @mixin flex-row-central;
  justify-content: space-between;
  width: 100%;
}
.top {
  margin-bottom: 9px;
}
.bottom {
  margin-top: 9px;
  min-height: 40px;
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
.icon {
  fill: transparent;
  stroke: #fff;
}
.btn.--grey {
  background-color: var(--c-grey-17);
}
.status .--bold {
  font-weight: 600;
}
</style>
