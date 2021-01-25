import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import { createEvent } from 'effector-root'

Vue.use(VueRouter)
Vue.use(VueMeta)

export const router = new VueRouter({
  mode: 'history',
})

type MetaItem = {
  name: string
  content: string
}

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title)
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags)
  const nameDataAtr = 'data-vue-router'
  // set title if it exist
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title || 'Electronic Education'
  // // remove prev page meta tags
  const oldMetaTags: HTMLElement[] = Array.from(document.querySelectorAll(`[${nameDataAtr}]`))
  if (oldMetaTags.length) oldMetaTags.map((el: any) => el.parentNode.removeChild(el))
  if (!nearestWithMeta) return next()
  // set arr meta tags
  const metaTags: HTMLMetaElement[] = nearestWithMeta.meta.metaTags.map((tagDef: MetaItem) => {
    const tag = document.createElement('meta')
    Object.keys(tagDef).forEach((key) => tag.setAttribute(key, tagDef[key]))
    tag.setAttribute(nameDataAtr, '')
    return tag
  })
  // set to page our meta tags
  metaTags.forEach((tag: HTMLMetaElement) => document.head.appendChild(tag))
  next()
})

type Params = Record<string, string>

type Navigation = { query?: Params; params?: Params }
type UrlNavigate = { url: string } & Navigation
type NamedNavigate = { name: string } & Navigation

export type Navigate = UrlNavigate | NamedNavigate

const isNamedNavigation = (nav: Navigate): nav is NamedNavigate => !!(nav as NamedNavigate).name

export const navigatePush = createEvent<Navigate>()
export const navigateReplace = createEvent<Navigate>()

const navigateFactory = (navigationMethod: 'push' | 'replace') => (navigate: Navigate) => {
  const defaultOptions = { query: navigate.query, params: navigate.params }
  if (isNamedNavigation(navigate)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    router[navigationMethod]({ ...defaultOptions, name: navigate.name }).catch(() => {})
  } else {
    router[navigationMethod]({ ...defaultOptions, path: navigate.url })
  }
}

navigatePush.watch(navigateFactory('push'))
navigateReplace.watch(navigateFactory('replace'))
