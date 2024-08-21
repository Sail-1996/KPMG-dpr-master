// ** Third Party Components

import { useContext, useEffect, useReducer, useState } from 'react'
import Chart from 'react-apexcharts'
import { useForm } from 'react-hook-form'

// ** Reactstrap Imports
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import {
  abbreviateNumber,
  FM,
  formatDate,
  generateArrayOfMonths,
  generateArrayOfYears,
  isValid,
  log
} from '@src/utility/Utils'
import { ApexOptions } from 'apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { useLoadManpowerGraphMutation } from '../../redux/RTKQuery/GraphRTK'
import useUser from '@hooks/useUser'
import Show from '@src/utility/Show'
const areaColors = {
  series3: '#a4f8cd',
  series2: '#60f2ca',
  series1: '#2bdac7'
}

interface States {
  lastRefresh?: any
  reportData?: any
  page?: any
  per_page_record?: any
  search?: any
  filterData?: any
}

interface propsType {
  direction?: any
  details?: DPR
}
const years = generateArrayOfYears(50)
const months = generateArrayOfMonths()
const ManpowerGraph = ({ direction, details = {} }: propsType) => {
  const initState: States = {
    page: 1,
    reportData: [],
    per_page_record: 30,
    lastRefresh: new Date().getTime()
  }
  const form = useForm<any>()
  const { handleSubmit, control, reset, setValue, watch, setError } = form
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const { colors } = useContext(ThemeColors)
  const [uploadStats, resultStats] = useLoadManpowerGraphMutation()
  const user = useUser()
  const resultDataRecord: any = resultStats?.data?.data
  const [year] = useState(new Date().getFullYear())

  const currentDate = new Date()
  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)
  const currentMonthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate)

  // Set the default selected month to the current month
  useEffect(() => {
    setValue('month', { label: currentMonth, value: currentMonthShort })
  }, [currentMonth])

  useEffect(() => {
    uploadStats({
      jsonData: {
        month: watch('month')?.value,
        year: watch('year')?.value,
        project_id: watch('project_id')?.value,
        vendor_id: watch('vendor_id')?.value,
        work_pack_id: watch('work_pack_id')?.value
      }
    })
  }, [
    state?.lastRefresh,
    watch('month'),
    watch('year'),
    watch('project_id'),
    watch('vendor_id'),
    watch('work_pack_id')
  ])

  // ** Chart Options

  const columnChartOptionsMonthly: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%'
        // endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    yaxis: {
      labels: {
        formatter(val: any) {
          return abbreviateNumber(val)
        }
      }
    },
    xaxis: {
      categories: isValid(watch('month'))
        ? [...(resultDataRecord?.date?.map((e: any) => formatDate(e, 'DD')) ?? [])]
        : [...(resultDataRecord?.months ?? [])] ?? []
    },
    fill: {
      opacity: 1
    },
    // tooltip: {
    //   y: {
    //     formatter(val: any) {
    //       return `${val}`
    //     }
    //   }
    // }
    tooltip: {
      custom(data: any) {
        return `<div class='px-1 py-50'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
            </div>`
      }
    }
  }

  // ** Chart Series
  const series = [
    {
      data: [...(resultDataRecord?.data ?? [])]
    }
  ]

  return (
    <Card>
      <CardHeader className='border-bottom '>
        <CardTitle tag={'h2'} className='text-primary fw-bolder mb-0'>
          {FM('manpower-graphs')}
        </CardTitle>
      </CardHeader>
      <CardHeader className='border-bottom'>
        <div className='flex-1'>
          <Row className='flex-1'>
            <Col md='3'>
              <Row className='g-0'>
                <Col md='6'>
                  {' '}
                  <div className=''>
                    <FormGroupCustom
                      label={FM('month')}
                      control={control}
                      defaultValue={{
                        label: currentMonth,
                        value: currentMonthShort
                      }}
                      type='select'
                      name='month'
                      noLabel
                      selectOptions={months}
                    />
                  </div>
                </Col>
                <Col md='6'>
                  {' '}
                  <div className=''>
                    <FormGroupCustom
                      label={FM('year')}
                      control={control}
                      defaultValue={{ label: year, value: year }}
                      type='select'
                      name='year'
                      noLabel
                      selectOptions={years.map((item: any) => ({ label: item, value: item }))}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md='3'>
              <div className=''>
                <FormGroupCustom
                  label={FM('project')}
                  name={'project_id'}
                  type={'select'}
                  className=''
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
                  noLabel
                  control={control}
                  rules={{
                    required: false
                  }}
                />
              </div>
            </Col>
            <Col md='3'>
              <div className=''>
                <Show IF={isValid(user)}>
                  <FormGroupCustom
                    label={FM('vendor')}
                    name={'vendor_id'}
                    type={'select'}
                    className=''
                    path={ApiEndpoints.list_vendor}
                    selectLabel='name'
                    selectValue={'id'}
                    jsonData={{
                      vendor_id: user?.vendor_id ? user?.vendor_id : null,
                      status: 1
                    }}
                    async
                    defaultOptions
                    loadOptions={loadDropdown}
                    isClearable
                    control={control}
                    noLabel
                    rules={{
                      required: false
                    }}
                  />
                </Show>
              </div>
            </Col>
            <Col md='3'>
              <div className=''>
                <FormGroupCustom
                  label={FM('work-package')}
                  name={'work_pack_id'}
                  type={'select'}
                  className=''
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
                  noLabel
                  control={control}
                  rules={{
                    required: false
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </CardHeader>

      <CardBody className='p-1'>
        <Chart
          key={resultDataRecord?.data?.length}
          options={columnChartOptionsMonthly}
          series={series}
          type='bar'
          height={400}
        />
      </CardBody>
    </Card>
  )
}
export default ManpowerGraph
