import Vue from 'vue'
import { VueEffector } from 'effector-vue/effector-vue.umd'
import { router } from '@/features/navigation'
import { config } from '@/config'
import { setTokenForRequest } from '@/features/api/common/request'
import { loadSession } from '@/features/session'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Cookies from 'js-cookie'
import App from './App.vue'
import { routes } from './routes'
import 'dayjs/locale/ru'
import '@/assets/css/common.css'

dayjs.extend(relativeTime)
dayjs.locale('ru')

Vue.use(VueEffector)

Vue.config.productionTip = false

router.addRoutes(routes)

export const timelessToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjI3NzcwOTY0LCJqdGkiOiIzMzg0ODczMDE5ODg0NDY3YTVjMWYwZGE5MzY4ZTljNiIsInVzZXJfaWQiOjF9.-G0FDmGTxZno9cUxDF-Hk8OlMYKTZdNlcWuT1CxP188'

const token = Cookies.get(config.TOKEN_KEY)

if (token) {
  setTokenForRequest(token)
  loadSession()
} else {
  setTokenForRequest(timelessToken)
}

export const app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
