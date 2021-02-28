<template>
  <div class="subject-page">
    <SubjectHeader
      title="Создание предмета"
      @save="updateSubject(false)"
      @saveAndBackToList="updateSubject(true)"
    />
    <div class="content">
      <LeftBlock />
      <RightBlock />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SubjectHeader from '@/pages/dictionary/subjects/common/Header.vue'
import {
  changeIfRedirect,
  save,
} from '@/pages/dictionary/subjects/create/subjects-creation-page.model'
import { clearFields } from '@/pages/dictionary/subjects/common/create-edit.model'
import LeftBlock from '@/pages/dictionary/subjects/common/LeftBlock.vue'
import RightBlock from '@/pages/dictionary/subjects/common/RightBlock.vue'

export default Vue.extend({
  name: 'SubjectEditPage',
  components: { SubjectHeader, LeftBlock, RightBlock },
  methods: {
    clearFields,
    changeIfRedirect,
    save,
    updateSubject(isRedirect: boolean) {
      changeIfRedirect(isRedirect)
      save()
    },
  },
  beforeDestroy() {
    clearFields()
  },
})
</script>

<style scoped>
.content {
  display: flex;
  margin-top: 20px;
  padding: 30px;
  width: 100%;
  background-color: #fff;
  border-radius: 3px;
}
</style>
