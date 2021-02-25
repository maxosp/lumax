export type FileType =
  | 'file'
  | 'pdf'
  | 'doc'
  | 'xml'
  | 'ppt'
  | 'rar'
  | 'zip'
  | 'txt'
  | 'img'
  | 'audio'

export type UploadMediaResponse = {
  id: number
  file_type: FileType
  file: string
  file_name: string
  duration_sec: number
}
