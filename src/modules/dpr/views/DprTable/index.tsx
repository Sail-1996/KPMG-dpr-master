/* eslint-disable no-dupe-else-if */
/* eslint-disable no-mixed-operators */
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import CustomDataTable, {
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'
import { getPath } from '@src/router/RouteHelper'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { stateReducer } from '@src/utility/stateReducer'
import { emitAlertStatus, FM, isValid, log, SuccessToast, truncateText } from '@src/utility/Utils'
import { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Activity, Edit, MoreVertical, Plus, RefreshCcw, Rss, Sliders, Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Form,
  Button,
  ButtonProps
} from 'reactstrap'
import { DPR } from '@src/utility/types/typeDPR'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import {
  useCreateOrUpdateConfigMutation,
  useDeleteConfigByIdMutation,
  useLoadConfigMutation
} from '@src/modules/dpr/redux/RTKQuery/DprConfigRTK'
import ConfirmAlert from '@hooks/ConfirmAlert'
import { IconSizes } from '@src/utility/Const'
import DropDownMenu from '@src/modules/common/components/dropdown'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import BsTooltip from '@src/modules/common/components/tooltip'
import { Permissions } from '@src/utility/Permissions'
import ConfigFilter from '../Config/ConfigFilter'
import Show from '@src/utility/Show'

type States = {
  filterData?: any
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
  configFilter?: boolean
  id?: any
  profile_name?: any
}

const DPRTable = () => {
  const initState: States = {
    page: 1,
    showModal: false,
    rowData: {},
    per_page_record: 40,
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
    },
    id: null,
    profile_name: null
  }
  const { colors } = useContext(ThemeColors)
  const form = useForm<DPR>({
    defaultValues: {
      profile_name: ''
    }
  })
  const params = useParams()
  const { handleSubmit, control, reset, setValue, watch } = form

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const navigate = useNavigate()
  const [loadConfig, { data, isLoading }] = useLoadConfigMutation()
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }
  const configData = data?.data
  log(configData, 'configData')

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const moveTo = useCallback(() => {
    if (isValid(watch('profile_name'))) {
      const profile = watch('profile_name')?.extra
      navigate(getPath('dpr.update', { id: profile?.id, name: profile?.profile_name }), {
        state: {
          id: profile?.id,
          name: profile?.profile_name,
          hideTab: true
        }
      })
    }
  }, [watch('profile_name')])

  // useEffect(() => {
  //   moveTo()
  // }, [state?.id, state?.profile_name])

  return (
    <>
      <ConfigFilter
        show={state?.configFilter}
        filterData={state?.filterData}
        setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
        handleFilterModal={() => {
          setState({
            configFilter: false
          })
        }}
      />
      <Header icon={<Activity size='25' />} title={FM('dpr-interface')}></Header>
      <Card>
        <CardBody>
          <Row>
            <Show IF={Permissions.interfaceBrowse}>
              <Col md='9'>
                <FormGroupCustom
                  label={FM('select-config')}
                  name={'profile_name'}
                  type={'select'}
                  className='mb-2'
                  path={ApiEndpoints.list_config}
                  selectLabel='profile_name'
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
            </Show>
            <Col sm='3'>
              <LoadingButton
                block
                loading={isLoading}
                className='mt-2'
                color='primary'
                type='submit'
                onClick={moveTo}
              >
                {FM('submit')}
              </LoadingButton>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

export default DPRTable
