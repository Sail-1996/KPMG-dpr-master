import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useImportDPRTemplateMutation } from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
import { useLoadManpowerMutation } from '@src/modules/dpr/redux/RTKQuery/GraphRTK'
import Emitter from '@src/utility/Emitter'
import Hide from '@src/utility/Hide'
import { Permissions } from '@src/utility/Permissions'
import Show from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import {
  fastLoop,
  FM,
  formatDate,
  hasExtension,
  isValid,
  isValidArray,
  log,
  setInputErrors,
  SuccessToast
} from '@src/utility/Utils'
import { Fragment, useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row, Table } from 'reactstrap'

type theProps = {
  loading?: boolean
  filterTransaction?: boolean
  filterImport?: boolean
  closeForm: () => void
  sheetName?: any
  configName?: any
  getData?: any
  getConfigData?: any
  getDataDate?: any
}
interface States {
  search?: any
  page?: any
  per_page_record?: any
  loading?: boolean
  text?: string
  list?: any
  formData?: DPR
}
const Import = (props: theProps) => {
  const initState: States = {
    loading: false,
    text: '',
    list: [],
    formData: {
      manpower: '',
      sheet_name: null,
      change_reason_for_plan_ftm: null,
      work_item: null,
      file: null
    }
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const params = useParams()
  const form = useForm<DPR>({
    defaultValues: {
      manpower: '',
      change_reason_for_plan_ftm: '',
      file: ''
    }
  })
  const { handleSubmit, control, reset, setValue, watch, clearErrors, setError } = form
  const [importDPR, result] = useImportDPRTemplateMutation()
  const [loadManpower, { data, isLoading, isSuccess }] = useLoadManpowerMutation()

  const onSubmit = (d: DPR) => {
    log(d)
    if (isValidArray(d?.file)) {
      if (hasExtension(d.file[0]?.name, ['.xlsx', '.xls', '.csv'])) {
        importDPR({
          ...d,
          file: d?.file[0],
          sheet_name: props?.getData?.sheet_name,
          dpr_config_id: props?.configName
        })
      } else {
        setError('file', { type: 'custom' })
      }
    } else {
      setError('file', { type: 'custom' })
    }
  }

  useEffect(() => {
    if (result?.isSuccess) {
      // SuccessToast('File Imported Successfully')
      Emitter.emit('reloadLogs', true)
      reset()
    }
  }, [result?.isSuccess])

  useEffect(() => {
    if (result?.isError) {
      const e: any = result?.error
      setInputErrors(e?.data?.data, setError)
      reset()
    }
  }, [result?.isError])

  useEffect(() => {
    loadManpower({
      jsonData: {
        data_date: formatDate(new Date(), 'YYYY-MM-DD')
      }
    })
  }, [params?.id, formatDate(new Date(), 'YYYY-MM-DD')])

  //   const tests = data?.data
  const tests = formatDate(new Date(), 'YYYY-MM-DD') as any
  // sum all the manpower by project and work_package
  const groupProject = () => {
    const re: any[] = []
    fastLoop(tests, (test, index) => {
      if (re?.hasOwnProperty(test?.project)) {
        re[test?.project] = ''
      } else {
        re[test?.project] = ''
      }
    })
    // log(re)
    return re
  }

  // merge work_package
  const getWorkPackage = (key?: string) => {
    const oreo: any[] = []
    const re: any[] = []
    fastLoop(tests, (test, index) => {
      if (key) {
        if (re?.hasOwnProperty(test?.project)) {
          re[test?.project] = {
            data: [...re[test?.project]?.data, ...test?.profiles?.map((a) => a)],
            project: test?.project
          }
        } else {
          re[test?.project] = { data: test?.profiles?.map((a) => a), project: test?.project }
        }
      }
      fastLoop(test?.profiles, (profile, index) => {
        // find name
        const findIndex = oreo?.findIndex((a) => a?.name === profile?.work_package)
        if (findIndex !== -1) {
          oreo[findIndex] = {
            name: profile?.work_package,
            manpower: key
              ? re[key]?.data
                  ?.filter((a) => a?.work_package === profile?.work_package)
                  ?.map((a) => a?.manpower)
                  .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
              : 0,
            key
          }
        } else {
          oreo.push({
            name: profile?.work_package,
            manpower: key
              ? re[key]?.data
                  ?.filter((a) => a?.work_package === profile?.work_package)
                  ?.map((a) => a?.manpower)
                  .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
              : 0,
            key
          })
        }
      })
    })
    // log(oreo)
    return oreo
  }

  // get the manpower by work_package
  const getPackageWiseData = (key: string) => {
    const re: any[] = []
    fastLoop(getWorkPackage(key), (work_package, index) => {
      re.push(<td>{work_package?.manpower ?? 0}</td>)
    })
    return re
  }

  // loop through all the projects
  const renderTrTd = () => {
    const re: any[] = []
    for (const [key, value] of Object.entries(groupProject())) {
      re.push(
        <tr>
          <td>{key}</td>
          {getPackageWiseData(key)}
        </tr>
      )
    }
    return re
  }

  return (
    <Fragment>
      <Card>
        <CardBody className='pt-2'>
          <Form onSubmit={handleSubmit(onSubmit)} enctype='multipart/form-data'>
            <Row className=' mb-2'>
              <Col md='4'>
                <FormGroupCustom
                  key={String(result.isError) + String(result.isSuccess)}
                  label={FM('manpower(yesterday)')}
                  name={'manpower'}
                  type={'number'}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='4'>
                <FormGroupCustom
                  key={String(result.isError) + String(result.isSuccess)}
                  label={FM('change-reason-for-plan-FTM')}
                  name={'change_reason_for_plan_ftm'}
                  type={'text'}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Show IF={Permissions.importEdit}>
                <Col md='4'>
                  <FormGroupCustom
                    label={FM('upload-excel-file')}
                    accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    name={'file'}
                    key={String(result.isError) + String(result.isSuccess)}
                    type={'file'}
                    className='mb-0'
                    errorMessage={'Please select only .xlsx or .xls extension file'}
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
              </Show>
            </Row>
            <Col md='3'>
              <LoadingButton loading={result?.isLoading} className='' color='primary'>
                {FM('import-dpr')}
              </LoadingButton>
            </Col>
          </Form>
        </CardBody>
      </Card>
      <Show IF={isValidArray(data?.data)}>
        <Show IF={isLoading}>
          <>
            <Shimmer style={{ height: 50, marginBottom: 20 }} />
            <Shimmer style={{ height: 50, marginBottom: 20 }} />
            <Shimmer style={{ height: 50, marginBottom: 20 }} />
          </>
        </Show>
        <Hide IF={isLoading}>
          <Card>
            <CardBody className='pb-0 border-bottom mb-2 pt-1'>
              <Row md='12' className='d-flex justify-contents-between align-items-between'>
                <Col className=''>
                  <h5 className='fw-bolder mb-1'>{FM('manpower-table')}</h5>
                </Col>
                <Col>
                  <h5 className='fw-bolder text-end mb-1'>
                    {FM('data-date')} : {formatDate(props.getDataDate, 'DD MMM YYYY')}{' '}
                  </h5>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='border-bottom pt-0'>
              <ScrollBar>
                <Table>
                  <thead>
                    <tr>
                      <th>{FM('project')}</th>
                      {getWorkPackage().map((workPackage, index) => {
                        return <th>{workPackage?.name}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>{renderTrTd()}</tbody>
                </Table>
              </ScrollBar>
            </CardBody>
          </Card>
        </Hide>
      </Show>
    </Fragment>
  )
}

export default Import
