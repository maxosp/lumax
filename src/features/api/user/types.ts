import { GetListQueryParams } from '@/features/api/types'

export type LoginFxParams = {
  email: string
  password: string
}

export type LoginFxResponse = {
  access: string
  refresh: string
}

export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  is_moderator: boolean
  is_teacher: boolean
  is_student: boolean
  date_joined: string
}

export type GetUsersListQueryParams = {
  is_student?: boolean
} & GetListQueryParams
