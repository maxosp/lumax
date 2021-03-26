<template>
  <div class="preview-tasks-page">
    <Controller />
    <Card class="previw-task">
      <iframe
        ref="iframe"
        :src="iframeLink"
        seamless
        width="100%"
      />
    </Card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Controller from '@/pages/preview-tasks/Controller.vue'
import Card from '@/ui/card/Card.vue'
import { config } from '@/config'

export default Vue.extend({
  name: 'PreviewTasksPage',
  components: { Controller, Card },
  data: () => ({
    questionId: null as null | string,
    token: null as null | string,
    type: null as null | string,
    heightIframe: 0,
    prevRouteName: '',
  }),
  computed: {
    iframeLink() {
      return this.questionId && this.type && this.token
        ? `${config.PREVIEW_URL}/question?questionId=${this.questionId}&type=${this.type}&token=${this.token}`
        : ''
    },
  },
  // записываю предыдущий раут
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // @ts-ignore
      vm.prevRoute = from.name || 'home'
    })
  },
  created() {
    const { questionId, token, type } = this.$route.query
    if (questionId && typeof questionId === 'string') this.questionId = questionId
    if (token && typeof token === 'string') this.token = token
    if (type && typeof type === 'string') this.type = type
    if (!this.questionId || !this.token || !this.type) {
      this.$router.push({ name: this.prevRouteName })
    }
  },
  mounted() {
    // костыль для получения высоты контента внутри iframe
    window.addEventListener('message', (event) => {
      if (event.data.height && this.heightIframe !== event.data.height) {
        this.heightIframe = event.data.height
        const el = this.$refs.iframe as HTMLElement
        if (el) el.style.height = `${event.data.height}px`
      }
    })
  },
})
</script>

<style scoped>
.previw-task {
  padding: 0;
  margin-top: 20px;
}
</style>
