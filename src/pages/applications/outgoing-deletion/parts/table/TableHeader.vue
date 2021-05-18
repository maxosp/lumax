<template>
  <div
    class="header"
    :class="{invisible: !total, '--expand': this.selectedApplications.length}"
  >
    <div class="left">
      <span class="text">{{ total | formatTasksTitle }}</span>
      <Divider
        v-if="this.selectedApplications.length"
        vertical
        height="25px"
        class="divider"
      />
      <span
        v-if="selectedApplications.length === 1"
        class="text --basic"
        @click="$emit('onOpen', selectedApplications[0])"
      >
        Открыть
      </span>
      <span
        v-if="selectedApplications.length === 1"
        class="text --basic"
        @click="$emit('onSeeComment', selectedApplicationsIds[0])"
      >
        Посмотреть комментарий
      </span>
      <span
        v-if="this.selectedApplications.length"
        class="text --basic"
        @click="$emit('onCancel', selectedApplicationsIds)"
      >
        Отменить
      </span>
      <span
        v-if="this.selectedApplications.length"
        class="text --basic"
        @click="$emit('onRemoveSelection')"
      >
        Снять выделение
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Divider from '@/ui/divider/Divider.vue'
import { ApplicationType } from '@/pages/applications/types'

export default Vue.extend({
  name: 'TableHeader',
  components: {
    Divider,
  },
  props: {
    total: { type: Number, required: true },
    selectedApplications: { type: Array as PropType<ApplicationType[]> },
  },
  computed: {
    selectedApplicationsIds() {
      return this.selectedApplications.map((el) => el.application)
    },
  },
})
</script>

<style scoped>
.invisible {
  display: none;
}

.header {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background-color: #fff;
  color: var(--base-text-primary);
  font-size: 16px;
  line-height: 16px;
  border-bottom: 1px solid var(--c-grey-9);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  .divider {
    background-color: var(--c-grey-15);
    margin: 0 25px;
  }
  .text {
    cursor: pointer;
  }
  .text.--basic {
    margin-right: 25px;
  }
  .text.--basic:last-of-type {
    margin-right: 0;
  }
  .left {
    @mixin flex-row-central;
  }
}
@media screen and (max-width: 1150px) {
  .header.--expand {
    height: fit-content;
    min-height: 44px;
    overflow-x: auto;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .header.--expand .left {
    min-width: 800px;
  }
}
</style>
