import Vue from 'vue'
import { VueEffector } from 'effector-vue/effector-vue.umd'
import { router } from '@/features/navigation'
import { config } from '@/config'
import { setTokenForRequest } from '@/features/api/common/request'
import { loadSession } from '@/features/session'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Cookies from 'js-cookie'
import VTooltip from 'v-tooltip'

import { formatTagTitle } from '@/pages/tags/utils'
import { formatThemeTitle } from '@/pages/dictionary/themes/utils'
import { formatTotalAmount } from '@/pages/dictionary/themes/list/utils'
import { formatTasksTitle } from '@/pages/bank/olympiad-tasks/utils'

import App from './App.vue'
import { routes } from './routes'
import 'dayjs/locale/ru'
import '@/assets/css/common.css'

dayjs.extend(relativeTime)
dayjs.locale('ru')

Vue.use(VTooltip, {
  defaultBoundariesElement: document.body,
})

Vue.filter('formatTagTitle', formatTagTitle)
Vue.filter('formatThemeTitle', formatThemeTitle)
Vue.filter('formatTotalAmount', formatTotalAmount)
Vue.filter('formatTasksTitle', formatTasksTitle)

Vue.use(VueEffector)

Vue.config.productionTip = false

router.addRoutes(routes)

// не реактивный
const token = Cookies.get(config.TOKEN_KEY)
if (token) {
  setTokenForRequest(token)
  loadSession()
}

export const app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
