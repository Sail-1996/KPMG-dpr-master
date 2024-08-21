/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { HttpListResponse, HttpResponse, PagePerPageRequest } from '@src/utility/types/typeResponse'
import { isValid } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { axiosBaseQuery } from '@src/utility/http/Http'
import { DPR } from '@src/utility/types/typeDPR'

interface RequestType extends PagePerPageRequest {
  jsonData?: any
  sheet_name?: any
  dpr_config_id?: any
}
interface ResponseType extends HttpResponse<DPR> {
  someExtra: any
}

interface ResponseTypeList extends HttpListResponse<DPR> {
  someExtra: any
}

export const DPRManagement = createApi({
  reducerPath: 'DPRManagement',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    createOrUpdateDPR: builder.mutation<ResponseType, DPR>({
      query: (jsonData) => ({
        jsonData,
        showSuccessToast: true,
        method: 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.dpr_create_update
          : ApiEndpoints.dpr_create_update
      })
    }),
    loadDPRById: builder.mutation<ResponseType, RequestType>({
      query: (jsonData) => ({
        method: 'post',
        jsonData,
        path: ApiEndpoints.dpr_view
      })
    }),
    loadDprList: builder.mutation<ResponseTypeList, RequestType>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.dpr_list
      })
    })
  })
})
export const { useCreateOrUpdateDPRMutation, useLoadDPRByIdMutation, useLoadDprListMutation } =
  DPRManagement
