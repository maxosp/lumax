import { File } from '@/features/api/subject/types'
import { FolderType } from '../assignment/types'

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

export type UpdateMediaType = {
  id: number
  file_name: string
  folder_id?: number
}
export type CopyToMediaType = {
  folder_id: number
  media_id: number
}
export type UploadMediaResponse = {
  id: number
  file_type: FileType
  file: string
  file_name: string
  duration_sec: number
  folder?: Partial<FolderType>
  folder_id?: number | null
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
  study_year_id?: number
  subject_id?: number
  theme_id?: number
} & CreateResourceType

export type GetResourcesTreeQueryParams = {
  sort?: string
  subject?: number
  study_year?: number
  search?: string
  search_area?: string
}

export type CopyToFolderType = {
  folder_to_id: number
  folder_obj_id: number
}
