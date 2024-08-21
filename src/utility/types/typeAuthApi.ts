import { RequestType } from '../http/Http'
import { HttpResponse } from './typeResponse'

// Login Api Types
export interface LoginApiArgs extends RequestType {
  success?: (e?: LoginApiResponse) => void
  token?: any
  jsonData?: any
  dispatch?: (e?: any) => void
}

export type LoginApiResponse = HttpResponse<UserData>

// User data
export interface UserData {
  id?: number
  name?: string
  email?: string
  email_verified_at?: null
  role_id?: number
  mobile_number?: null
  address?: null
  designation?: null
  status?: number
  created_at?: string
  updated_at?: string
  deleted_at?: null
  access_token?: string
  roles?: null
  role_name?: null
  permissions?: PermissionsEntity[] | null
}
export interface PermissionsEntity {
  id?: number
  action?: string
  subject?: string
  se_name?: string
  pivot?: Pivot
}
export interface Pivot {
  role_id?: number
  permission_id?: number
}

export interface Log {
  event?: string
  id?: number
  created_by?: any
  type?: string
  ip_address?: string
  location?: any
  status?: string
  last_record_before_edition?: any
  failure_reason?: any
  created_at?: string
  updated_at?: string
}

export interface AuditLog {
  id: number
  log_name: string
  description: string
  subject_type: string
  event: string
  subject_id: number
  causer_type: string
  causer_id: number
  properties: Properties
  batch_uuid: any
  created_at: string
  updated_at: string
  name: string
  causer: Causer
}

export interface Properties {
  attributes: any
  old: any
}

export interface Causer {
  id: number
  name: string
}
