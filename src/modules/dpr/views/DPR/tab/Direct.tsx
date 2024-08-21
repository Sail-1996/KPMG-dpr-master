import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useCreateOrUpdateDirectMutation } from '@src/modules/dpr/redux/RTKQuery/DprDirectRTK'
import { useLoadManpowerMutation } from '@src/modules/dpr/redux/RTKQuery/GraphRTK'
import Hide from '@src/utility/Hide'
import Show from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { fastLoop, FM, isValid, isValidArray, formatDate, log } from '@src/utility/Utils'
import { useEffect, useReducer } from 'react'
import { Control, useFieldArray, useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row, Table } from 'reactstrap'

type theProps = {
  loading?: boolean
  filterTransaction?: boolean
  filterDirect?: boolean
  closeForm: () => void
  getConfigData?: any
  getDataDate?: any
  getData?: any
}
type States = {
  active?: string
  loading?: boolean
  list?: any
  formData?: any
  lastRefresh?: any
  sheet_name?: any
}
const Direct = (props: theProps) => {
  const initState: States = {
    list: null,

    formData: {
      id: null,
      sheet_name: null,
      name: null,
      value: null,
      item_desc: null
    }
  }
  const form = useForm<DPR>({})
  const { handleSubmit, control, reset, setValue, watch } = form
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'dpr_data' // unique name for your Field Array
  })
  const params = useParams()

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const [createDirect, result] = useCreateOrUpdateDirectMutation()
  const [loadManpower, { data, isLoading, isSuccess }] = useLoadManpowerMutation()

  const onSubmit = (dataMap: DPR, index: any) => {
    createDirect({
      dpr_config_id: params?.id,
      ...dataMap
    })
  }

  useEffect(() => {
    const data = props?.getData
    const dprValue: any[] = []
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        log('element', element)
        if (key !== 'sheet_name') {
          const parts = key?.split('-OrderNo#')
          dprValue?.push({
            name: parts[0],
            order_no: parts[1],
            dpr_value: element?.map((a) => {
              return {
                item_desc: a?.item_desc?.title,
                value: a?.value
              }
            })
          })
        }
      }
    }
    setValue('dpr_data', dprValue)
  }, [props?.getData])

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
          re[test?.project] = {
            data: test?.profiles?.map((a) => a),
            project: test?.project
          }
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
                  ?.filter((a: any) => a?.work_package === profile?.work_package)
                  ?.map((a: any) => a?.manpower)
                  .reduce((partialSum: any, a: any) => Number(partialSum) + Number(a), 0)
              : 0,
            key
          }
        } else {
          oreo.push({
            name: profile?.work_package,
            manpower: key
              ? re[key]?.data
                  ?.filter((a: any) => a?.work_package === profile?.work_package)
                  ?.map((a: any) => a?.manpower)
                  .reduce((partialSum: any, a: any) => Number(partialSum) + Number(a), 0)
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
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Col md='12' className=''>
            <Card>
              <CardBody className='pt-2'>
                <Show IF={result.isLoading}>
                  <>
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                    <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  </>
                </Show>
                <Hide IF={result.isLoading}>
                  <>
                    {fields?.map((f: any, i) => {
                      return (
                        <>
                          <Row key={f.id} className='mb-2 border pb-2 pt-2'>
                            <Col md='1'>
                              <FormGroupCustom
                                name={`dpr_data.${i}.order_no`}
                                label={FM('order-no')}
                                type={'text'}
                                isDisabled={true}
                                className='mb-2'
                                control={control}
                                rules={{ required: false }}
                              />
                            </Col>
                            <Col md='2'>
                              <FormGroupCustom
                                name={`dpr_data.${i}.name`}
                                label={FM('cell-desc')}
                                type={'text'}
                                isDisabled={true}
                                className='mb-2'
                                control={control}
                                rules={{ required: false }}
                              />
                            </Col>

                            <Col md='9'>
                              <FieldArray control={control} index={i} />
                            </Col>
                          </Row>
                        </>
                      )
                    })}
                  </>
                </Hide>
                <Col sm='3'>
                  <LoadingButton loading={result?.isLoading} className='' color='primary'>
                    <>{FM('submit')}</>
                  </LoadingButton>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Form>
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
    </>
  )
}

export default Direct

// custom hook for rendering each item in the array
function FieldArray(props: { control: Control<any>; index: number }) {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: props.control, // control props comes from useForm (optional: if you are using FormContext)
    name: `dpr_data.${props.index}.dpr_value` // unique name for your Field Array
  })

  return (
    <>
      <Row>
        {fields?.map((field: any, index) => (
          <>
            <Col md='6' key={field.id}>
              <FormGroupCustom
                name={`dpr_data.${props.index}.dpr_value.${index}.item_desc`}
                label={FM('item-desc')}
                isDisabled={field?.item_desc}
                type={'text'}
                className='mb-2'
                control={props.control}
                rules={{ required: false }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                name={`dpr_data.${props.index}.dpr_value.${index}.value`}
                label={FM('value')}
                type={'text'}
                className='mb-2'
                control={props.control}
                rules={{ required: true }}
              />
            </Col>
          </>
        ))}
      </Row>
    </>
  )
}
