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

export const WorkPackageManagement = createApi({
  reducerPath: 'WorkPackageManagement',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadWorkPackage: builder.mutation<ResponseTypeList, RequestType>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.list_work_package
      })
    }),
    createOrUpdateWorkPackage: builder.mutation<ResponseType, DPR>({
      query: (jsonData) => ({
        jsonData,
        showSuccessToast: true,
        method: isValid(jsonData?.id) ? 'put' : 'post',
        path: isValid(jsonData?.id)
          ? ApiEndpoints?.edit_work_package + jsonData?.id
          : ApiEndpoints.add_work_package
      })
    }),
    deleteWorkPackageById: builder.mutation<ResponseType, DPR>({
      query: ({ id }) => ({
        method: 'delete',
        path: ApiEndpoints.delete_work_package + id
      })
    }),
    loadWorkPackageDetailsById: builder.mutation<ResponseType, DPR>({
      query: (a) => ({
        jsonData: a?.jsonData,
        method: 'get',
        params: { page: a?.page, per_page_record: a?.per_page_record },
        path: ApiEndpoints.view_work_package + a?.id
      })
    }),
    loadWorkPackageAction: builder.mutation<ResponseType, DPR>({
      query: (a) => ({
        jsonData: a?.jsonData,
        showSuccessToast: true,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'post',
        path: ApiEndpoints.action_work_package
      })
    })
  })
})
export const {
  useLoadWorkPackageMutation,
  useCreateOrUpdateWorkPackageMutation,
  useDeleteWorkPackageByIdMutation,
  useLoadWorkPackageDetailsByIdMutation,
  useLoadWorkPackageActionMutation
} = WorkPackageManagement
