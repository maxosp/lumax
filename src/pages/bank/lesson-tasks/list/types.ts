export type TableField = {
  name: string
  sortField?: string
  titleClass?: string
  dataClass?: string
  title: string
  width?: string
  formatter?: (value: any) => any
}

export type ResourceChip = {
  count: string
  description: string
}

export type ContextMenuType = 'table_lessons' | 'lesson'
