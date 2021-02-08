<template>
  <div v-if="$props.visible" class="themes-filter">
    <div class="section">
      <SubjectsDropdown />
    </div>
    <div class="section">
      <ClassesDropdown />
    </div>
    <div class="section">
      <AuthorsDropdown />
    </div>
    <Icon type="cross" />
  </div>
</template>

<script>
import Vue from 'vue'
import AuthorsDropdown from '@/pages/themes/parts/themes-filter/parts/authors-dropdown/AuthorsDropdown.vue'
import ClassesDropdown from '@/pages/themes/parts/themes-filter/parts/classes-dropdown/ClassesDropdown.vue'
import SubjectsDropdown from '@/pages/themes/parts/themes-filter/parts/subjects-dropdown/SubjectsDropdown.vue'

import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'ThemesFilter',
  components: {
    AuthorsDropdown,
    ClassesDropdown,
    SubjectsDropdown,
    Icon,
  },
  props: {
    visible: { type: Boolean, required: true, default: false },
  },
})
</script>

<style>
.themes-filter {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  padding: 30px 20px;
  background-color: #fff;
  z-index: 1;
  display: flex;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  & + .section {
    margin-left: 40px;
  }
}
</style>