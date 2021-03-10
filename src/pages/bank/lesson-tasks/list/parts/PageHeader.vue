<template>
  <GridPageHead title="Банк заданий">
    <div class="buttons">
      <RouterLink :to="{ name: 'lesson-tasks-creation' }">
        <BaseButton
          class="btn"
          yellow
        >
          Создать задание
        </BaseButton>
      </RouterLink>
      <RouterLink :to="{ name: 'themes-create' }">
        <BaseButton
          class="btn"
          yellow
        >
          Создание темы
        </BaseButton>
      </RouterLink>
      <BaseButton class="btn">
        <div class="btn-content">
          <span>
            Выгрузить
          </span>
          <Divider vertical height="40px" />
          <Icon type="settings" size="20" />
        </div>
      </BaseButton>
    </div>
  </GridPageHead>
</template>

<script lang="ts">
import Vue from 'vue'
import GridPageHead from '@/pages/common/grid-parts/GridPageHead.vue'
import BaseButton from '@/ui/button/BaseButton.vue'
import Divider from '@/ui/divider/Divider.vue'
import Icon from '@/ui/icon/Icon.vue'

export default Vue.extend({
  name: 'PageHeader',
  components: {
    BaseButton,
    Divider,
    Icon,
    GridPageHead,
  },
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
}

.title {
  color: var(--base-text-primary);
  font-size: 20px;
  font-weight: bold;
}

.buttons {
  display: flex;
}

.btn {
  min-width: 130px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
}

.btn-content {
  display: flex;
  align-items: center;
  & /deep/ .divider {
    margin: 0 10px;
    background-color: var(--c-dark-1);
  }
}
a {
  margin-right: 15px;
}
a + .btn {
  padding-right: 10px;
  padding-left: 15px;
}
</style>
