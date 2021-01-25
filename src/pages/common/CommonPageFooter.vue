<template>
  <div class="common-page-footer">
    <div class="wrapper-footer-content">
      <div class="wrapper-links">
        <router-link
          :to="{ name: 'common.policy' }"
          class="link-foter text-footer"
        >
          Политика конфиденциальности
        </router-link>
        <router-link
          :to="{ name: 'common.faq' }"
          class="link-foter text-footer"
        >
          FAQ
        </router-link>
        <router-link
          :to="{ name: 'common.contacts' }"
          class="link-foter text-footer"
        >
          Контакты
        </router-link>
      </div>
      <p class="text-footer">
        © {{ year }} Electronic education
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CommonPageFooter',
  data: () => ({
    year: new Date().getFullYear(),
  }),
})
</script>

<style scoped>
.common-page-footer {
  padding: 0 30px;
}
.wrapper-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.wrapper-links {
  display: flex;
}
.link-foter {
  padding: 20px 20px 30px;
  &:first-child {
    padding-left: 0;
  }
}
.text-footer {
  font-size: 13px;
  line-height: 0.92;
  text-align: right;
  color: #2c2c2c;
  text-decoration: none;
}
</style>


