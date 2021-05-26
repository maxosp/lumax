import { ResourceType } from '@/features/api/media/types'
import { TreeData } from '@/features/api/types'
import { FiltersParams } from '@/pages/common/types'
import Vue, { PropType } from 'vue'

type AutoOpenMixinConfig = {
  filters: {
    [key: string]: (item: TreeData, search: string) => boolean
  }
}

export default (config?: AutoOpenMixinConfig) =>
  Vue.extend({
    props: {
      filters: { type: Object as PropType<FiltersParams> },
    },
    data: () => ({
      opened: false,
      searchString: '',
    }),
    computed: {
      autoOpenMixinComputed() {
        return {
          search: this.filters.search?.toLowerCase() || '',
        }
      },
    },
    methods: {
      checkCustomFilter(node: TreeData) {
        if (!this.searchString) return false
        return config?.filters![this.searchString](node, this.autoOpenMixinComputed.search)
      },
      toggleData() {
        this.opened = !this.opened
      },
      checkChildren(nodes: TreeData[]): boolean {
        return nodes.some((n) => {
          if (this.checkCustomFilter(n)) {
            return true
          }
          let name = 'name'
          if (n.element_type === 'media') name = 'file_name'
          if (n.element_type === 'study_resource') {
            name = n[n.element_type]?.resource_type!
          }
          if (n.element_type === 'assignment') name = 'wording'
          return n[n.element_type]![name].includes(this.autoOpenMixinComputed.search)
        })
      },
      checkChildrenTypes(nodes: TreeData[], search: string) {
        return nodes.some((n) => n.element_type === search)
      },
      chooseName(node: TreeData) {
        const map = {
          media: 'file_name',
          study_resource: (node[node.element_type] as ResourceType)?.resource_type!,
          assignment: 'wording',
        }
        return map[node.element_type] || 'name'
      },
      autoOpenFolders(nodes: TreeData[]) {
        this.searchString = this.searchString === 'all' ? '' : this.searchString
        nodes.forEach((node) => {
          let name = this.chooseName(node)
          if (this.searchString.length > 0) {
            if (
              node.element_type === this.searchString &&
              node[node.element_type]![name].toLowerCase().includes(
                this.autoOpenMixinComputed.search
              )
            ) {
              this.opened = false
              return
            }
            if (
              node.leaves &&
              (this.checkChildrenTypes(node.leaves, this.searchString) ||
                this.checkChildren(node.leaves))
            ) {
              this.opened = true
              return
            }
          }
          if (this.searchString.length === 0) {
            if (
              node[node.element_type]![name].toLowerCase().includes(
                this.autoOpenMixinComputed.search
              )
            ) {
              this.opened = true
              return
            }
            if (+this.autoOpenMixinComputed.search) {
              name = 'id'
              if (
                node[node.element_type]![name].toString().includes(
                  this.autoOpenMixinComputed.search
                )
              ) {
                this.opened = true
                return
              }
            }
            if (node.leaves && this.checkChildren(node.leaves)) {
              this.opened = true
              return
            }
          }
          if (this.checkCustomFilter(node)) {
            this.opened = true
            return
          }
          if (node.element_type !== this.searchString) {
            this.autoOpenFolders(node.leaves)
          }
        })
      },
    },
  })
