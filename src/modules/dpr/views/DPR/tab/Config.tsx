import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import { useCreateOrUpdateConfigMutation } from '@src/modules/dpr/redux/RTKQuery/DprConfigRTK'
import { Patterns } from '@src/utility/Const'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { fillObject, FM, isValid, setValues, SuccessToast } from '@src/utility/Utils'
import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'

type theProps = {
  loading?: boolean
  filterConfig?: boolean
  filterMonthly?: boolean
  closeForm: () => void
  getConfigData?: any
}
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
const Config = (props: theProps) => {
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
  const nav = useNavigate()
  const form = useForm<DPR>()
  const params = useParams()
  const { handleSubmit, control, reset, setValue, watch } = form

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [createConfig, result] = useCreateOrUpdateConfigMutation()

  useEffect(() => {
    if (isValid(props?.getConfigData) && props?.getConfigData !== undefined) {
      const f = fillObject<DPR>(state.formData, props?.getConfigData)
      const formData: DPR = {
        ...f,
        project_id: {
          value: props?.getConfigData?.project_id,
          label: props?.getConfigData?.project?.name
        },
        vendor_id: {
          value: props?.getConfigData?.vendor_id,
          label: props?.getConfigData?.vendor?.name
        },
        work_pack_id: {
          value: props?.getConfigData?.work_pack_id,
          label: props?.getConfigData?.work_package?.name
        },
        profile_name: props?.getConfigData?.profile_name
      }
      setValues<DPR>(formData, setValue)
    }
  }, [props?.getConfigData])

  const onSubmit = (e: DPR) => {
    if (isValid(params?.id)) {
      createConfig({
        id: params?.id,
        ...e,
        project_id: e?.project_id?.value,
        vendor_id: e?.vendor_id?.value,
        work_pack_id: e?.work_pack_id?.value
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
    }
  }, [result])

  return (
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
                jsonData={{
                  status: 1
                }}
                async
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
                jsonData={{
                  status: 1
                }}
                async
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
                jsonData={{
                  status: 1
                }}
                async
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
              <LoadingButton loading={result?.isLoading} type='submit' className='' color='primary'>
                <>{FM('update')}</>
              </LoadingButton>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

export default Config
