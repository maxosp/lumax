<template>
  <Modal
    class="dialog"
    :value="$modalVisibility"
    @change="modalVisibilityChanged"
  >
    <div class="top">
      <p class="title"> Назначение модератора </p>
      <div class="icon-wrapper">
        <Icon
          type="close"
          size="16"
          class="icon"
          @click="modalVisibilityChanged(false)"
        />
      </div>
    </div>
    <form @submit.prevent>
      <FormInput
        :value="$searchString"
        label=""
        :max-length="100"
        placeholder="Введите имя модератора"
        class="input"
        :clear-btn="true"
        @input="searchStringChanged"
        @clear="clearSearchString"
      />
    </form>
    <ul class="list">
      <li
        v-for="moderator in $moderators"
        :key="+moderator.name"
        class="element"
      >
        <span class="moderator-title"> {{ moderator.title }} </span>
        <span
          class="btn"
          @click="submit(+moderator.name)"
        >
          Выбрать
        </span>
      </li>
    </ul>
    <BasePagination
      :selected-page="$selectedPage"
      :count="$count"
      class="pagination"
      @change-page="selectedPageChanged"
      @go-to-prev-page="selectedPageChanged(selectedPage - 1)"
      @go-to-next-page="selectedPageChanged(selectedPage + 1)"
    />
    <div class="btn-wrapper">
      <p
        class="text --underline"
        @click="modalVisibilityChanged(false)"
      >
        Отменить
      </p>
    </div>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/ui/modal/Modal.vue'
import Icon from '@/ui/icon/Icon.vue'
import FormInput from '@/ui/input/FormInput.vue'
import BasePagination from '@/ui/pagination/BasePagination.vue'
import {
  $modalVisibility,
  modalVisibilityChanged,
  $searchString,
  searchStringChanged,
  $selectedPage,
  $count,
  selectedPageChanged,
  $moderators,
  submit,
  clearSearchString,
} from '@/pages/applications/modals/set-to-moderator/set-to-moderator.model'

export default Vue.extend({
  name: 'ModeratorModal',
  components: {
    Modal,
    Icon,
    FormInput,
    BasePagination,
  },
  effector: {
    $modalVisibility,
    $searchString,
    $selectedPage,
    $count,
    $moderators,
  },
  methods: {
    modalVisibilityChanged,
    searchStringChanged,
    selectedPageChanged,
    submit,
    clearSearchString,
  },
})
</script>

<style scoped>
.dialog ::v-deep .modal-body {
  width: 580px;
  padding: 20px;
}
.top {
  @mixin flex-row-central;
  justify-content: space-between;
  margin-bottom: 30px;
  .title {
    font-size: 18px;
    line-height: 22px;
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
  & ::v-deep .label {
    margin: 0;
  }
}
.list {
  margin-bottom: 30px;
  .element {
    width: 100%;
    height: 24px;
    @mixin flex-row-central;
    justify-content: space-between;
    margin-bottom: 16px;
    .moderator-title {
      color: #0f2345;
      font-weight: 600;
    }
    .btn {
      @mixin flex-center;
      height: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      color: #fff;
      background: var(--base-text-primary);
      border-radius: 22px;
      cursor: pointer;
    }
  }
}
.pagination {
  outline: 1px solid;
}
.btn-wrapper {
  width: 100%;
  @mixin flex-row-central;
  justify-content: center;
  .--underline {
    cursor: pointer;
    @mixin underline-text;
  }
}
</style>
