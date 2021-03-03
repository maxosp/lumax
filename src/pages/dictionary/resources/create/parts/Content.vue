<template>
  <Card class="content">
    <div class="left">
      <PositionDropdown :class="{'--error': $positionError}" />
    </div>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/ui/card/Card.vue'
// import FormInput from '@/ui/input/FormInput.vue'
import PositionDropdown from '@/pages/dictionary/themes/create/parts/position/PositionDropdown.vue'
import {
  $positionError,
  $subjectError,
  $classError,
} from '@/pages/dictionary/themes/create/theme-creation-page.model'

export default Vue.extend({
  components: {
    Card,
    // FormInput,
    PositionDropdown,
  },
  effector: {
    $positionError,
    $subjectError,
    $classError,
  },
  methods: {},
})
</script>

<style scoped>
.content {
  width: 100%;
  height: fit-content;
  padding: 30px;
  padding-bottom: 140px;
  box-sizing: border-box;
  margin-top: 20px;
  & ::v-deep .content {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
}
.left {
  width: 630px;
  .input {
    margin-bottom: 20px;
  }
}

.--error ::v-deep .inner-input {
  border: 2px solid var(--c-red-0) !important;
}
@media screen and (max-width: 1340px) {
  .content ::v-deep .content {
    justify-content: flex-start;
    overflow-x: scroll;
    overflow-y: hidden;
    box-sizing: border-box;
    padding-bottom: 30px;
  }
  .left {
    margin-right: 30px;
    min-width: 630px;
  }
}
</style>
