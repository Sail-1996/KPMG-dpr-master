/* eslint-disable no-dupe-else-if */
/* eslint-disable no-mixed-operators */
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import CustomDataTable, {
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'
import { getPath } from '@src/router/RouteHelper'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { stateReducer } from '@src/utility/stateReducer'
import { fillObject, FM, isValid, log, setValues, SuccessToast } from '@src/utility/Utils'
import { useContext, useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Plus, RefreshCcw, Rss } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ButtonGroup, Card, CardBody, CardHeader, CardTitle, Col, Row, Form } from 'reactstrap'
import { DPR } from '@src/utility/types/typeDPR'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import {
  useCreateOrUpdateConfigMutation,
  useLoadConfigDetailsByIdMutation,
  useLoadConfigMutation
} from '@src/modules/dpr/redux/RTKQuery/DprConfigRTK'
import { Patterns } from '@src/utility/Const'

type States = {
  active?: string
  filterConfig?: boolean
  filterMap?: boolean
  filterImport?: boolean
  filterLog?: boolean
  filterDirect?: boolean
  loading?: boolean
  list?: any
  formData?: any
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  showModal?: boolean
  rowData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
}

const ConfigForm = () => {
  const initState: States = {
    page: 1,
    showModal: false,
    rowData: {},
    per_page_record: 15,
    search: '',
    lastRefresh: new Date().getTime(),
    active: '1',
    filterConfig: false,
    filterMap: false,
    filterImport: false,
    filterLog: false,
    filterDirect: false,
    loading: false,
    list: [],
    formData: {
      id: null,
      sheet_name: null,
      name: null,
      cell_value: null,
      row_position: null,
      row_new_position: null
    }
  }
  const { colors } = useContext(ThemeColors)
  const nav = useNavigate()
  const form = useForm<DPR>()
  const params = useParams()
  const { handleSubmit, control, reset, setValue, watch } = form

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [createConfig, result] = useCreateOrUpdateConfigMutation()
  const [getConfig, { data, isSuccess, isLoading }] = useLoadConfigDetailsByIdMutation()

  const getData: DPR | undefined = data?.data

  useEffect(() => {
    if (isValid(params?.id)) {
      getConfig({
        id: params?.id
      })
    }
  }, [params?.id])

  useEffect(() => {
    if (isValid(getData) && getData !== undefined) {
      const f = fillObject<DPR>(state.formData, getData)
      const formData: DPR = {
        ...f,
        project_id: {
          value: getData?.project_id,
          label: getData?.project?.name
        },
        vendor_id: {
          value: getData?.vendor_id,
          label: getData?.vendor?.name
        },
        work_pack_id: {
          value: getData?.work_pack_id,
          label: getData?.work_package?.name
        },
        profile_name: getData?.profile_name
      }
      setValues<DPR>(formData, setValue)
    }
  }, [getData])

  const onSubmit = (e: DPR) => {
    if (isValid(params?.id)) {
      createConfig({
        id: params?.id,
        ...e,
        project_id: e?.project_id?.value,
        vendor_id: e?.vendor_id?.value,
        work_pack_id: e?.work_pack_id?.value,
        status: getData?.status
      })
    } else {
      createConfig({
        ...e,
        project_id: e?.project_id?.value,
        vendor_id: e?.vendor_id?.value,
        work_pack_id: e?.work_pack_id?.value
      })
    }
  }

  useEffect(() => {
    if (result.isSuccess) {
      // SuccessToast(FM('executed-successfully'))
      reset()
    }
  }, [result])

  useEffect(() => {
    if (result?.isSuccess) {
      nav(-1)
    }
  }, [result?.isSuccess])

  return (
    <>
      <Header
        onClickBack={() => nav(-1)}
        goBackTo
        icon={<Rss size='25' />}
        title={FM('dpr-management-update')}
      ></Header>
      <Card>
        <CardBody className='pt-2'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='3'>
                <FormGroupCustom
                  label={FM('project')}
                  name={'project_id'}
                  type={'select'}
                  className='mb-2'
                  path={ApiEndpoints.list_project}
                  selectLabel='name'
                  selectValue={'id'}
                  async
                  jsonData={{
                    status: 1
                  }}
                  defaultOptions
                  loadOptions={loadDropdown}
                  isClearable
                  control={control}
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  label={FM('vendor')}
                  name={'vendor_id'}
                  type={'select'}
                  className='mb-2'
                  path={ApiEndpoints.list_vendor}
                  selectLabel='name'
                  selectValue={'id'}
                  async
                  jsonData={{
                    status: 1
                  }}
                  defaultOptions
                  loadOptions={loadDropdown}
                  isClearable
                  control={control}
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  label={FM('work-package')}
                  name={'work_pack_id'}
                  type={'select'}
                  className='mb-2'
                  path={ApiEndpoints.list_work_package}
                  selectLabel='name'
                  selectValue={'id'}
                  async
                  jsonData={{
                    status: 1
                  }}
                  defaultOptions
                  loadOptions={loadDropdown}
                  isClearable
                  control={control}
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  name={'profile_name'}
                  label={FM('profile-name')}
                  type={'text'}
                  className='mb-2'
                  control={control}
                  rules={{ required: true, pattern: Patterns.AlphaNumericWithAtperSpaceHash }}
                />
              </Col>
              <Col sm='3' className=''>
                <LoadingButton
                  loading={result.isLoading}
                  type='submit'
                  className=''
                  color='primary'
                >
                  <>{FM('update')}</>
                </LoadingButton>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  )
}

export default ConfigForm
