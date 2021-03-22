export type FilePickerEvent = {
  getFormData: (key: string, otherKeys?: any) => FormData
  files: FileList | null
  filesArray: File[]
  nativeEvent: HTMLInputElement
}
