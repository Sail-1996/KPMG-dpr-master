/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { isValid } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { axiosBaseQuery } from '@src/utility/http/Http'
import { DPR } from '@src/utility/types/typeDPR'
import { HttpListResponse, HttpResponse, PagePerPageRequest } from '@src/utility/types/typeResponse'

interface RequestType extends PagePerPageRequest {
  jsonData?: any
}
interface ResponseType extends HttpResponse<DPR> {
  someExtra: any
}

interface ResponseTypeList extends HttpListResponse<DPR> {
  someExtra: any
}

export const DPRImportManagement = createApi({
  reducerPath: 'DPRImportManagement',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    importDPRTemplate: builder.mutation<DPR, any>({
      query: (jsonData) => ({
        formData: jsonData,
        showSuccessToast: true,
        method: 'post',
        path: ApiEndpoints?.dpr_import
      })
    }),
    importDPRListTemplate: builder.mutation<ResponseTypeList, RequestType>({
      query: (formData) => ({
        formData,
        method: 'post',
        path: ApiEndpoints?.dpr_import_list
      })
    }),
    importDprList: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints?.import_dpr_list
      })
    }),
    downloadDpr: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        showSuccessToast: true,
        method: 'post',
        path: ApiEndpoints?.download_dpr
      })
    }),
    workItemList: builder.mutation<ResponseType, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints?.list_work_item
      })
    }),
    importSummary: builder.mutation<any, any>({
      query: (jsonData) => ({
        jsonData,
        method: 'post',
        path: ApiEndpoints?.summary
      })
    })
  })
})
export const {
  useImportDPRListTemplateMutation,
  useImportDPRTemplateMutation,
  useDownloadDprMutation,
  useImportDprListMutation,
  useWorkItemListMutation,
  useImportSummaryMutation
} = DPRImportManagement
