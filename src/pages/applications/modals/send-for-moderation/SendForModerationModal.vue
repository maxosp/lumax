<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Оставить комментарий </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <BaseTextarea
      class="textarea"
      :class="{'--error': commentError}"
      :max-length="200"
      placeholder="Введите ваш комментарий"
      :value="$comment"
      label="Комментарий"
      @input="commentChanged"
    />
    <div class="imgs-wrapper">
      <label class="input-wrapper">
        <span class="label">
          <Icon
            type="photo"
            size="24"
            class="icon"
          />
          Прикрепить изображения
        </span>
        <input
          id="fileInput"
          ref="fileInput"
          class="fileInput"
          type="file"
          name="file"
          accept="image/*"
          @change="handleFileUpload"
        >
      </label>
      <div class="imgs">
        <FileElement
          v-for="image in $imagesPreview"
          :id="image.id"
          :key="image.id"
          :name="image.file_name"
          :image="image.file"
          class="file-element"
          @delete="deleteMedia"
        />
      </div>
    </div>
    <div class="btns-wrapper">
      <BaseButton
        class="btn"
        big
        border-without-bg
        @click="modalVisibilityChanged(false)"
      >
        Отменить
      </BaseButton>
      <BaseButton
        class="btn"
        big
        @click="checkIfFormCanBeSend"
      >
        Отправить на доработку
      </BaseButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import FileElement from '@/pages/common/modals/applications/parts/FileElement.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $comment,
  commentChanged,
  $commentErrorModule,
  uploadFileFx,
  $imagesPreview,
  deleteMedia,
  checkIfFormCanBeSend,
  $ticketForm,
} from '@/pages/applications/modals/send-for-moderation/send-for-moderation.model'
import { RefsType } from '@/pages/common/types'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: RefsType
    }
  >
).extend({
  components: {
    Modal,
    Icon,
    BaseTextarea,
    BaseButton,
    FileElement,
  },
  effector: {
    $modalVisibility,
    $comment,
    $imagesPreview,
    commentError: $commentErrorModule.store.$error,
    $ticketForm,
  },
  computed: {
    images() {
      return []
    },
  },
  methods: {
    modalVisibilityChanged,
    commentChanged,
    deleteMedia,
    checkIfFormCanBeSend,
    handleFileUpload() {
      const { fileInput } = this.$refs
      uploadFileFx(fileInput!.files)
    },
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 420px;
  padding: 20px 20px 30px 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 30px;
  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    line-height: 22px;
    margin-top: 10px;
  }
  .icon {
    fill: var(--c-grey-3);
    &:hover {
      cursor: pointer;
    }
  }
}
.input {
  margin-bottom: 20px;
}
.--error ::v-deep .base-textarea {
  border: 2px solid var(--c-red-0) !important;
}
.imgs-wrapper {
  margin-top: 10px;
  .input-wrapper {
    @mixin flex-center;
    justify-content: flex-start;
    .label {
      @mixin flex-center;
      &:hover {
        cursor: pointer;
      }
    }
    .icon {
      margin-right: 10px;
    }
    .fileInput {
      display: none;
    }
  }
  .imgs {
    margin-top: 10px;
  }
  .file-element:not(:last-child) {
    margin-bottom: 10px;
  }
}
.btns-wrapper {
  @mixin flex-row-central;
  justify-content: center;
  margin-top: 30px;
  button:first-child {
    margin-right: 10px;
  }
}
</style>
