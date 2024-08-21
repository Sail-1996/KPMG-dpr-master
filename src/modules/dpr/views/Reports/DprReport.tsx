import useUser from '@hooks/useUser'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useImportDprListMutation } from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
import Hide from '@src/utility/Hide'
import Show from '@src/utility/Show'
import {
  ErrorToast,
  FM,
  SuccessToast,
  commaFormatter,
  fastLoop,
  formatDate,
  isValid,
  isValidArray,
  kFormatter,
  log
} from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { downloadPDF } from '@src/utility/http/Apis/downloadDPR'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import { DprReportList } from '@src/utility/types/typeDPR'
import { useEffect, useReducer, useState } from 'react'
import { Download } from 'react-feather'
import { useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Label, Row, Table } from 'reactstrap'
import { useLoadManpowerMutation } from '../../redux/RTKQuery/GraphRTK'

interface States {
  page?: any
  per_page_record?: any
  changeObject?: any
  search?: any
  reload?: any
  logFilter?: boolean
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  transactionFilter?: boolean
  filterData?: any
  lastRefresh?: any
  edit?: any
  selectedItem?: any
}
const DPRReport = () => {
  const initState: States = {
    page: 1,
    lastRefresh: new Date().getTime(),
    per_page_record: 15,
    changeObject: null,
    transactionFilter: false,
    filterData: null,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<DprReportList>()
  const nav = useNavigate()
  const [loadingSample, setLoadingSample] = useState(false)
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const [loadReport, { data, isError, isLoading, isSuccess }] = useImportDprListMutation()
  const [loadManpower, resultData] = useLoadManpowerMutation()
  const userData = useUser()

  const load = () => {
    if (isValid(watch('date'))) {
      loadReport({
        date: watch('date'),
        dpr_config_id: watch('dpr_config_id')?.value
      })
    }
  }

  const loadMan = () => {
    if (isValid(watch('date'))) {
      loadManpower({
        jsonData: {
          data_date: watch('date')
        }
      })
    }
  }

  useEffect(() => {
    load()
    loadMan()
  }, [state?.lastRefresh])

  const onSubmit = (d: any) => {
    load()
    loadMan()
  }

  const pdf = () => {
    downloadPDF({
      jsonData: {
        date: watch('date'),
        type: 'pdf',
        dpr_config_id: watch('dpr_config_id')?.value
      },
      loading: setLoadingSample,
      success: (e: any) => {
        window.open(`${e?.data}`, '_blank')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  const html = () => {
    downloadPDF({
      jsonData: {
        date: watch('date'),
        type: 'html',
        dpr_config_id: watch('dpr_config_id')?.value
      },
      loading: setLoadingSample,
      success: (e: any) => {
        window.open(`${e?.data}`, '_blank')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  const excel = () => {
    downloadPDF({
      jsonData: {
        date: watch('date'),
        type: 'excel',
        dpr_config_id: watch('dpr_config_id')?.value
      },
      loading: setLoadingSample,
      success: (e: any) => {
        window.open(`${e?.data}`, '_blank')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  const sendMail = () => {
    downloadPDF({
      jsonData: {
        date: watch('date'),
        email: watch('email')
      },
      loading: setLoadingSample,
      success: (e: any) => {
        SuccessToast('Email Sent Successfully')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  useEffect(() => {
    setValue('dpr_config_id', '')
  }, [watch('date')])

  const tests = resultData?.data?.data
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

  // Extract the keys (table headers) from the first data item
  const dataArray = data?.data?.map((a: any) => a) || []

  return (
    <>
      <Header onClickBack={() => nav(-1)} goBackTo title={FM('dpr-report')}></Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className='flex-1'>
              <Row>
                <Col md='3'>
                  <Label>
                    {FM('select-data-date')} <span className='text-danger fw-bolder'>*</span>
                  </Label>
                </Col>
                <Show IF={isValidArray(data?.data)}>
                  <Col md='3'>
                    <Label>{FM('select-work-item-data')}</Label>
                  </Col>
                </Show>
              </Row>
              <Row className='flex-1 g-1'>
                <Col md='3'>
                  <FormGroupCustom
                    placeholder={FM('select-data-date')}
                    label={FM('select-data-date')}
                    name={'date'}
                    type={'date'}
                    className='mb-0'
                    noLabel
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='3'>
                  <FormGroupCustom
                    label={FM('select-work-item-data')}
                    name={'dpr_config_id'}
                    type={'select'}
                    noLabel
                    className='mb-2'
                    placeholder='Vendor Name - Work Package'
                    path={ApiEndpoints.list_vendor_wp}
                    selectLabel='name_X_work_package'
                    onOptionData={(data: any[]) => {
                      return data?.map((a: any) => {
                        return {
                          ...a,
                          name_X_work_package: `${a?.vendor_name} - ${a?.work_package_name}`
                        }
                      })
                    }}
                    selectValue={'id'}
                    isClearable
                    async
                    defaultOptions
                    loadOptions={loadDropdown}
                    control={control}
                    rules={{
                      required: false
                    }}
                  />
                </Col>
                <Col md='2'>
                  <Button color='primary' type='submit' block rounded>
                    {FM('submit')}
                  </Button>
                </Col>
                <Show IF={isValidArray(data?.data)}>
                  <Show IF={watch('date')}>
                    <Col md='2' className=''>
                      <Button color='primary' block rounded onClick={pdf}>
                        <Download size={14} /> {FM('download-pdf')}
                      </Button>
                    </Col>
                    <Col md='2' className=''>
                      <Button color='primary' block rounded onClick={excel}>
                        <Download size={14} /> {FM('download-excel')}
                      </Button>
                    </Col>
                    <Col md='2' className=''>
                      <Button color='primary' block rounded onClick={html}>
                        <Download size={14} /> {FM('download-html')}
                      </Button>
                    </Col>
                    <Col md='2' className=''>
                      <FormGroupCustom
                        placeholder={FM('email')}
                        label={FM('email')}
                        name={'email'}
                        type={'text'}
                        className='mb-1'
                        noLabel
                        control={control}
                        rules={{ required: false }}
                      />
                    </Col>
                    <Col md='2'>
                      <Button color='primary' block rounded onClick={(e) => sendMail()}>
                        {FM('send-email-html')}
                      </Button>
                    </Col>
                  </Show>
                </Show>
              </Row>
            </div>
          </CardHeader>
        </Card>
        <Show IF={watch('date')}>
          <Show IF={isLoading}>
            <Row className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Shimmer style={{ height: 320 }} />
                  </Row>
                </CardBody>
              </Card>
            </Row>
          </Show>
          {dataArray?.map((item: any, index: any) => {
            const itemData = item?.item_data || []
            const uniqueKeys = new Set()

            itemData?.forEach((d: any) => {
              d?.data?.forEach((dataObj: any) => {
                Object.keys(dataObj).forEach((key) => {
                  uniqueKeys.add(key)
                })
              })
            })
            const tableHeaders1 = Array.from(uniqueKeys)
            const tableHeaders = tableHeaders1
            log('headers', tableHeaders)
            return (
              <>
                <Card>
                  <CardBody className='border-bottom'>
                    <ScrollBar>
                      <Row md='12' className='d-flex justify-contents-between align-items-between'>
                        <Col className=''>
                          <h5 className='fw-bolder mb-1 text-capitalize'>
                            {FM('work-item')} : {item?.work_item}{' '}
                          </h5>
                        </Col>
                        <Col>
                          <h5 className='fw-bolder text-end mb-1'>
                            {FM('date')} : {item?.date}{' '}
                          </h5>
                        </Col>
                      </Row>
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>{FM('project')}</th>
                            {tableHeaders
                              ?.filter((header: any, headerIndex) => {
                                // Specify the headers you want to keep
                                const headersToKeep = [
                                  'original_csv',
                                  'project_name',
                                  'project_status',
                                  'vendor_name',
                                  'file_name'
                                ] // Replace with your desired headers
                                return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
                              })
                              ?.map((header: any, index: any) => (
                                <th key={index}>{header}</th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {itemData?.map((itemD: any, itemIndex: any) => {
                            log('itemD', itemD)
                            return (
                              <>
                                <tr>
                                  <td className='fw-bolder'>{itemD?.project_name}</td>
                                  {tableHeaders
                                    ?.filter((header: any, headerIndex) => {
                                      // Specify the headers you want to keep
                                      const headersToKeep = [
                                        'original_csv',
                                        'project_name',
                                        'project_status',
                                        'vendor_name',
                                        'file_name'
                                      ] // Replace with your desired headers
                                      return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
                                    })
                                    ?.map((header: any, headerIndex: any) => {
                                      if (header === 'Change reason for plan ftm') {
                                        return <>{null}</>
                                      }
                                      let sum: any = 0
                                      itemD?.data?.map((data: any, dataIndex: any) => {
                                        const headerValue = data?.[header]

                                        log('headerValue', headerValue)
                                        sum += headerValue

                                        return (
                                          <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
                                            {commaFormatter(headerValue)}
                                          </th>
                                        )
                                      })
                                      return (
                                        <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
                                          {commaFormatter(sum) === '0' ? '' : commaFormatter(sum)}
                                        </th>
                                      )
                                    })}
                                </tr>

                                {itemD.data?.map((data: any, dataIndex: any) => {
                                  //divide project value  -

                                  return (
                                    <tr key={`${itemIndex}`}>
                                      <td>
                                        <a href={data?.original_csv}>{data?.vendor_name}</a>
                                      </td>
                                      {tableHeaders
                                        ?.filter((header: any, headerIndex) => {
                                          // Specify the headers you want to keep
                                          const headersToKeep = [
                                            'original_csv',
                                            'project_name',
                                            'project_status',
                                            'vendor_name',
                                            'file_name'
                                          ] // Replace with your desired headers
                                          return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
                                        })
                                        ?.map((header: any, headerIndex: any) => {
                                          return (
                                            <td key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
                                              {commaFormatter(data?.[header])}
                                            </td>
                                          )
                                        })}
                                    </tr>
                                  )
                                })}
                              </>
                            )
                          })}
                        </tbody>
                      </Table>
                    </ScrollBar>
                  </CardBody>
                </Card>
              </>
            )
          })}
          {isSuccess && !isValidArray(data?.data) ? (
            <Card>
              <CardBody className=''>
                <Row className='px-2 fw-bolder'>
                  There are no records to display. Please select the correct Date.
                </Row>
              </CardBody>
            </Card>
          ) : (
            ''
          )}
          <Show IF={isValidArray(resultData?.data?.data)}>
            <Card>
              <CardBody className='pb-0 border-bottom mb-2 pt-1'>
                <Row md='12' className='d-flex justify-contents-between align-items-between'>
                  <Col className=''>
                    <h5 className='fw-bolder mb-1'>{FM('manpower-table')}</h5>
                  </Col>
                  <Col>
                    <h5 className='fw-bolder text-end mb-1'>
                      {FM('data-date')} : {formatDate(watch('date'), 'DD MMM YYYY')}{' '}
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
          </Show>
        </Show>
      </Form>
    </>
  )
}

export default DPRReport
