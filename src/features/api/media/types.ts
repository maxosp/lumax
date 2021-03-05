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

export type CreateResourceType = {
  id?: number
  link: string
  text: string
  resource_type: string
  theme_id: number
  media_id?: number
}

export type Resource = {
  id: number
  link?: string
  text?: string
  file?: string
  file_name?: string
  resource_type: string
  media_id?: number
  theme_id?: number
}
