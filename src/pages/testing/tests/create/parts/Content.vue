<template>
  <div class='container'>
    <div class="header">
      <TypeDropdown class="type-dropdown" @setItem="setTestType" />
      <BaseSwitch
        class="switch"
        :checked="$filterByStudyYear"
        @change="toggleFilterByStudyYear"
      >
        <p>Фильтрация заданий по классу</p>
      </BaseSwitch>
      <span class="label">Количество тем в тесте: {{ $selectedThemes.length }}</span>
    </div>
    <div class='content'>
      <div class='base'>
        <div class='left'>
          <SubjectDropdown class="field" @setItem="setSubject" />
          <component
            v-if="$testType"
            :is="testComponent"
          />
          <div class='field'>
            <div class='wording-head'>
              <span class='label'>Название теста</span>
            </div>
            <BaseTextarea
              placeholder="Введите название теста"
              :value="$wording"
              @input="setWording"
            />
          </div>
          <div class='field'>
            <span class='label'>Инструкция к тесту</span>
            <Wysiwyg
              :value="$containing"
              placeholder="Напишите краткую инструкцию для ученика"
              @input="setContaining"
            />
          </div>
          <FinalTextForm />
        </div>
        <div class='right'>
          <BaseSwitch
            class="switch field"
            :checked="$archive"
            @change="toggleArchive"
          >
            <p>Архив</p>
          </BaseSwitch>
          <div class="settings field">
            <span class="title">Настройки теста</span>
            <ClassDropdown
              v-if="$filterByStudyYear"
              class="field"
              @setItem="setStudyYear"
            />
            <RadioGroup
              class="field"
              :items="[
                { option: '0', label: 'Тест для всех пользователей класса' },
                { option: '1', label: 'Тест для группы' },
              ]"
              direction="vertical"
              :value="$testScope"
              @change="toggleTestScope"              
            />
            <GroupsDropdown v-if="$testScope === '1'" class="field" />
            <BaseSwitch
              class="switch field"
              :checked="$testAccess"
              @change="toggleTestAccess"
            >
              <p>Указать период когда тест доступен</p>
            </BaseSwitch>
            <StartToEndDatetime
              v-if="$testAccess"
              class="datetime-picker"
              label="Время"
            />
            <BaseSwitch
              class="switch field"
              :checked="$timeLimit"
              @change="toggleTimeLimit"
            >
              <p>Задать лимит времени</p>
            </BaseSwitch>
            <div v-if="$timeLimit">
              <div class='wording-head'>
                <span class='label'>Макс. время выполнения теста в минутах</span>
              </div>
              <BaseTextarea                
                placeholder="Укажите максимальное время выполнения"
                :value="$maxTime"
                @input="setMaxTime"
              />
            </div>
          </div>
          <div class='field'>
            <div class='wording-head'>
              <span class='label'>Внутренний комментарий CMS</span>
            </div>            
            <BaseTextarea
              placeholder="Введите комментарий"
              :value="$cmsComment"
              @input="setCMSComment"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseSwitch from '@/ui/switch/BaseSwitch.vue'
import BaseTextarea from '@/ui/input/BaseTextarea.vue'
import ClassDropdown from '@/pages/common/dropdowns/class/ClassesDropdown.vue'
import FinalTextForm from '@/pages/common/parts/tests/parts/final-text-form/FinalTextForm.vue'
import GroupsDropdown from '@/pages/common/parts/tests/parts/groups-dropdown/GroupsDropdown.vue'
import RadioGroup from '@/ui/radio/RadioGroup.vue'
import StartToEndDatetime from '@/pages/common/parts/tests/parts/datetime-picker/StartToEndDatetime.vue'
import SubjectDropdown from '@/pages/common/dropdowns/subject/SubjectsDropdown.vue'
import TypeDropdown from '@/pages/common/dropdowns/testing/type-dropdown/TypeDropdown.vue'
import Wysiwyg from '@/ui/wysiwyg/Wysiwyg.vue'
import {
  toggleArchive,
  $archive,
  $testType,
  setTestType,
  $subject,
  setSubject,
  $wording,
  setWording,
  $containing,
  setContaining,
  toggleFilterByStudyYear,
  $filterByStudyYear,
  setCMSComment,
  $cmsComment,
  setStudyYear,
  $studyYear,
  toggleTestScope,
  $testScope,
  toggleTestAccess,
  $testAccess,
  toggleTimeLimit,
  $timeLimit,
  setMaxTime,
  $maxTime,
} from '@/pages/testing/tests/create/test-create-page.model'
import { $selectedThemes } from '@/pages/common/parts/tests/automatic-generation/parts/themes-dropdown/themes-dropdown.model'
import * as tests from '@/pages/common/parts/tests'

export default Vue.extend({
  name: 'TaskContent',
  components: {
    BaseSwitch,
    BaseTextarea,
    ClassDropdown,
    FinalTextForm,
    GroupsDropdown,
    RadioGroup,
    StartToEndDatetime,
    SubjectDropdown,
    TypeDropdown,
    Wysiwyg,
  },
  effector: {
    $archive,
    $testType,
    $studyYear,
    $subject,
    $wording,
    $containing,
    $filterByStudyYear,
    $selectedThemes,
    $cmsComment,
    $testScope,
    $testAccess,
    $timeLimit,
    $maxTime,
  },
  computed: {
    testComponent() {
      if (this.$testType === null) {
        return null
      }
      return tests[this.$testType === '0' ? 'AutomaticGenerationForm' : 'ManualGenerationForm']
    },
  },
  methods: {
    setStudyYear,
    setTestType,
    setSubject,
    setWording,
    setCMSComment,
    setContaining,
    toggleArchive,
    toggleFilterByStudyYear,
    toggleTestScope,
    toggleTestAccess,
    toggleTimeLimit,
    setMaxTime,
  },
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 3px;
}
.content {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 3px;
}
.base {
  display: flex;
  justify-content: space-between;
}
.left,
.right {
  display: flex;
  flex-direction: column;
}
.left {
  flex-basis: 60%;
}
.right {
  flex-basis: 30%;
}
.tasks-count {
  display: flex;
  align-items: center;
}
.switch {
  display: flex;
  margin-top: 0px;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.label {
  color: #000;
  font-weight: 600;
  line-height: 17px;
}
.wording-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.type-dropdown {
  width: 260px;
}
.settings {
  padding: 20px;
  border: 1px dashed var(--c-grey-3);
  border-radius: 10px;
}
.title {
  display: flex;
  align-items: center;
  color: var(--base-text-primary);
  font-weight: bold;
  font-size: 20px;
  line-height: 18px;
  margin-bottom: 20px;
}
.close {
  cursor: pointer;
  margin-left: 20px;
  fill: var(--base-text-secondary);
}
.datetime-picker {
  margin-bottom: 20px;
}
</style>
