export type TableField = {
  name: string
  sortField?: string
  titleClass?: string
  dataClass?: string
  title: string
  width?: string
  formatter?: (value: any) => any
}

export type ApplicationType = {
  application: number
  task: number
  type?: string
}
