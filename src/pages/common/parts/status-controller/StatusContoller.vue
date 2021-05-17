<template>
  <div class="status-controller">
    <div class="status-block">
      <p class="label-status">Статус {{ isFromApplications ? 'заявки' : 'задания' }}:</p>
      <p class="value-status">{{ correctStatus }}</p>
    </div>
    <div class="buttons-block">
      <!-- todo: handle buttons position -->
      <BaseButton
        v-if="isReviewButtonVisible"
        class="btn"
        @click="$emit('onSendToReview')"
      >
        На проверку
      </BaseButton>
      <BaseButton
        v-if="isCommentButtonVisible"
        class="btn btn-comment"
        @click="onCommentButtonClick"
      >
        <Icon
          type="comment"
          size="20"
          class="icon"
        />
      </BaseButton>
      <BaseButton
        v-if="isAcceptAndRevisionVisible"
        class="btn green"
        @click="$emit('onAccept')"
      >
        Утвердить
      </BaseButton>
      <BaseButton
        v-if="isAcceptAndRevisionVisible"
        class="btn red"
        @click="$emit('onSendToRevision')"
      >
        На доработку
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { $applicationStatus, $status } from '@/pages/common/parts/status-controller/status.model'
import Icon from '@/ui/icon/Icon.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import {
  mapTaskStatus,
  mapApplicationsStatus,
} from '@/pages/common/parts/status-controller/constants'
import { $session } from '@/features/session'

export default Vue.extend({
  name: 'StatusController',
  components: { Icon, BaseButton },
  props: {
    fromPage: { type: String as PropType<string>, required: true },
    isPreview: { type: Boolean as PropType<boolean>, required: true },
    taskType: { type: String as PropType<string> },
  },
  effector: {
    $status,
    $session,
    $applicationStatus,
  },
  computed: {
    isFromApplications(): boolean {
      return this.fromPage === 'applications'
    },
    isFromTaskPages(): boolean {
      return this.fromPage === 'tasks'
    },
    useMapTaskStatus(): boolean {
      return ['tasks', 'labels', 'tags'].includes(this.fromPage)
    },
    isModerator(): boolean {
      return !!this.$session && this.$session.is_moderator
    },
    correctStatus(): string {
      if (this.$status) {
        return this.useMapTaskStatus
          ? mapTaskStatus[this.$status]
          : mapApplicationsStatus[this.$applicationStatus]
      }
      return ''
    },
    taskTypeIsTest(): boolean {
      return this.$props.taskType && this.$props.taskType === 'test-assignment'
    },
    isEditPage(): boolean {
      return !this.isPreview
    },
    isPreviewPage(): boolean {
      return this.isPreview
    },
    isReviewButtonVisible(): boolean {
      if (!this.taskTypeIsTest) return false
      if (this.isFromTaskPages && this.isEditPage) {
        return ['new', 'revision'].includes(this.$status)
      }
      if (this.isFromApplications && this.isEditPage) {
        return this.$applicationStatus === 'revision'
      }
      if (!this.isModerator && this.isPreviewPage) {
        return (
          ['new', 'moderation', 'revision'].includes(this.$status) ||
          ['new', 'moderation', 'revision'].includes(this.$applicationStatus)
        )
      }
      if (this.isModerator && this.isPreviewPage) {
        return this.$status === 'revision' || this.$applicationStatus === 'revision'
      }
      return false
    },
    isCommentButtonVisible(): boolean {
      if (!this.taskTypeIsTest) return false
      if (this.isFromApplications && this.isEditPage) {
        return ['revision', 'finished'].includes(this.$applicationStatus)
      }
      if (!this.isModerator && this.isPreviewPage && this.isFromApplications) {
        return ['waiting', 'revision'].includes(this.$applicationStatus)
      }
      if (this.isModerator && this.isPreviewPage && this.isFromApplications) {
        return ['revision', 'finished'].includes(this.$applicationStatus)
      }

      /*
        for now comment visible only fromApplications pages, for now saving logic for others
        if (this.isFromTaskPages && this.isEditPage) {
          return this.$status === 'revision'
        }
        if (!this.isModerator && this.isPreviewPage) {
          return (
            ['waiting', 'revision'].includes(this.$applicationStatus) ||
            ['moderation', 'revision'].includes(this.$status)
          )
        }
        if (this.isModerator && this.isPreviewPage) {
          return ['revision', 'finished'].includes(this.$applicationStatus)
        }
        todo: Handle other pages. Also add condition for presence of the comment
      */
      return false
    },
    isAcceptAndRevisionVisible(): boolean {
      return this.isFromApplications && this.isModerator && this.$applicationStatus === 'waiting'
    },
  },
  methods: {
    onCommentButtonClick() {
      /* todo: add others methods and conditions */
      this.$emit('onSeeComments')
    },
  },
})
</script>

<style scoped>
.status-controller {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
  min-height: 40px;
  & .buttons-block {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
}
.status-block {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.label-status {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-right: 10px;
}
.value-status {
  font-size: 14px;
  line-height: 17px;
}
.btn {
  margin-left: 20px;
  padding: 0 15px;
}
.btn-comment {
  background: var(--c-grey-17);

  .icon {
    fill: #fff;
  }
}
.red {
  background-color: var(--c-red-2);
}
.green {
  background-color: var(--c-green-1);
}
</style>
