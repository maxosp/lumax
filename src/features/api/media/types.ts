import { File } from '@/features/api/subject/types'

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
  link: string
  text: string
  resource_type: string
  theme: number
  media_id?: number | null
}
export type ResourceType = {
  file?: string
  file_name?: string
  theme?: number
  media?: File
  id: number
} & CreateResourceType

export type GetResourcesTreeQueryParams = {
  sort?: string
  subject?: string
  study_year?: number
  search?: string
  search_all?: string
  search_id?: string
  search_name?: string
  search_subject?: string
  search_study_year?: string
}
