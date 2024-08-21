/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { HttpListResponse, HttpResponse, PagePerPageRequest } from '@src/utility/types/typeResponse'
import { isValid } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { axiosBaseQuery } from '@src/utility/http/Http'
import { DPR } from '@src/utility/types/typeDPR'

interface RequestType extends PagePerPageRequest {
  id?: any
  jsonData?: any
  sheet_name?: any
}
interface ResponseType extends HttpResponse<DPR> {
  someExtra: any
  page?: any
  per_page_record?: any
}

interface ResponseTypeList extends HttpListResponse<DPR> {
  someExtra: any
}

export const ProfileManagement = createApi({
  reducerPath: 'ProfileManagement',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getProfile: builder.mutation<ResponseType, DPR>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.my_profile
      })
    }),
    updatePassword: builder.mutation<RequestType, DPR>({
      query: (a) => ({
        jsonData: a?.jsonData,
        showSuccessToast: true,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.changePassword
      })
    }),
    updateProfile: builder.mutation<ResponseType, DPR>({
      query: (jsonData) => ({
        jsonData,
        showSuccessToast: true,
        method: 'post',
        path: ApiEndpoints.updateProfile
      })
    }),
    getSetting: builder.mutation<ResponseType, DPR>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.app_setting_view
      })
    }),
    updateSetting: builder.mutation<ResponseType, DPR>({
      query: (formData) => ({
        formData,
        showSuccessToast: true,
        method: 'post',
        path: ApiEndpoints.app_setting_edit
      })
    })
  })
})
export const {
  useGetProfileMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useGetSettingMutation,
  useUpdateSettingMutation
} = ProfileManagement
