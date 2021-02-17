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
  file_url: string
  file_name: string
}
