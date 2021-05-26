import { createEvent, restore } from 'effector-root'
import { TableField } from '@/pages/bank/test-tasks/list/types'
import { createStore, forward } from 'effector'

type ExportColumns = {
  key?: boolean
}

type ExportColumnsNames = {
  key?: string
}

export const exportPopupDestroy = createEvent<void>()
export const changeExportPopupVisibility = createEvent<boolean>()
export const $exportPopupVisibility = restore(changeExportPopupVisibility, false).reset(
  exportPopupDestroy
)

export const initExportPopupStores = createEvent<TableField[]>()
function onInitExportPopupStores(
  _: ExportColumns | ExportColumnsNames,
  payload: TableField[],
  storeName: string
) {
  const columns = {}
  payload.forEach((field) => {
    if (field.name !== '__checkbox' && field.name !== 'actions') {
      if (storeName === '$exportColumns') columns[field.name] = true
      if (storeName === '$exportColumnsNames') columns[field.name] = field.title
    }
  })
  return columns
}

function onInitExportColumns(state: ExportColumns, payload: TableField[]) {
  return onInitExportPopupStores(state, payload, '$exportColumns')
}

function onInitExportColumnsNames(state: ExportColumnsNames, payload: TableField[]) {
  return onInitExportPopupStores(state, payload, '$exportColumnsNames')
}

export const changeTestAssignmentsExportColumns = createEvent<{ key: boolean }>()
function onChangeTestAssignmentsExportColumns(state: ExportColumns, params: ExportColumns) {
  return { ...state, ...params }
}

export const toggleSelectAll = createEvent<boolean>()
export const $allSelected = restore(toggleSelectAll, true).reset(exportPopupDestroy)
function onToggleSelectAll(state: ExportColumns, payload: boolean) {
  const columns = { ...state }
  for (const column in columns) {
    if (columns.hasOwnProperty(column)) {
      columns[column] = payload
    }
  }
  return columns
}

export const $exportColumns = createStore<ExportColumns>({})
  .on(initExportPopupStores, onInitExportColumns)
  .on(changeTestAssignmentsExportColumns, onChangeTestAssignmentsExportColumns)
  .on($allSelected, onToggleSelectAll)
  .reset(exportPopupDestroy)

export const $exportColumnsNames = createStore<ExportColumnsNames>({})
  .on(initExportPopupStores, onInitExportColumnsNames)
  .reset(exportPopupDestroy)

export const uncheckAll = createEvent<void>()

function transformSelectedColumnsToQuery(columns: ExportColumns) {
  const exportedColumns = []

  for (const column in columns) {
    if (columns.hasOwnProperty(column) && columns[column]) exportedColumns.push(column)
  }

  return { export_fields: exportedColumns }
}
export const $exportColumnsQueryParam = $exportColumns.map(transformSelectedColumnsToQuery)

forward({
  from: uncheckAll,
  to: toggleSelectAll.prepend(() => false),
})
