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
import { useContext, useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import {
  Activity,
  CheckSquare,
  Edit,
  HardDrive,
  MinusCircle,
  MoreVertical,
  Plus,
  RefreshCcw,
  Rss,
  Sliders,
  Trash2
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
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
  ButtonProps,
  Badge
} from 'reactstrap'
import { DPR } from '@src/utility/types/typeDPR'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import {
  useCreateOrUpdateConfigMutation,
  useDeleteConfigByIdMutation,
  useLoadConfigActionMutation,
  useLoadConfigMutation
} from '@src/modules/dpr/redux/RTKQuery/DprConfigRTK'
import ConfirmAlert from '@hooks/ConfirmAlert'
import { IconSizes } from '@src/utility/Const'
import DropDownMenu from '@src/modules/common/components/dropdown'
import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import BsTooltip from '@src/modules/common/components/tooltip'
import ConfigFilter from './ConfigFilter'
import { Permissions } from '@src/utility/Permissions'
import Show, { Can } from '@src/utility/Show'
import useUser from '@hooks/useUser'
import Hide from '@src/utility/Hide'

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
}

const Config = () => {
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
    filterData: null,
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
  const form = useForm<DPR>({
    defaultValues: {
      profile_name: ''
    }
  })
  const params = useParams()
  const { handleSubmit, control, reset, setValue, watch } = form
  const user = useUser()
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const [loadConfig, { data, isLoading, originalArgs }] = useLoadConfigMutation()
  const [createConfig, result] = useCreateOrUpdateConfigMutation()
  const [deleteConfig, resultDelete] = useDeleteConfigByIdMutation()
  const [actionConfig, resultAction] = useLoadConfigActionMutation()
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }

  const onSubmit = (e: DPR) => {
    if (isValid(params?.id)) {
      createConfig({
        id: params?.id,
        ...e
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
    loadConfig({
      jsonData: {
        profile_name: isValid(state?.search) ? state.search : state?.filterData?.profile_name,
        ...state?.filterData,
        project_id: state?.filterData?.project_id?.value,
        vendor_id: state?.filterData?.vendor_id?.value,
        work_pack_id: state?.filterData?.work_pack_id?.value
      },
      page: isValid(state?.search) ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.search, state?.page, state?.per_page_record, state?.lastRefresh, state?.filterData])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  useEffect(() => {
    if (result.isSuccess) {
      // SuccessToast(FM('executed-successfully'))
      reset()
      reloadData()
    }
  }, [result])

  const handleDelete = (id?: any, eventId?: any) => {
    if (isValid(id)) {
      deleteConfig({
        id,
        eventId
      })
    }
  }

  useEffect(() => {
    log('resultDelete', resultDelete)
    if (resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
      }
    }
  }, [resultDelete])

  const handleAction = (ids?: any, action?: any, eventId?: any) => {
    // log('id', id)
    if (isValid(ids)) {
      // delete single
      actionConfig({
        ids,
        eventId,
        originalArgs: resultAction?.originalArgs,
        jsonData: {
          ids,
          action
        }
      })
    }
  }
  useEffect(() => {
    if (resultAction?.isLoading === false) {
      if (resultAction?.isSuccess) {
        emitAlertStatus('success', null, resultAction?.originalArgs?.eventId)
      } else if (resultAction?.error) {
        emitAlertStatus('failed', null, resultAction?.originalArgs?.eventId)
      }
    }
  }, [resultAction])

  const columns: TableColumn<any>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('profile-name'),
      sortable: true,
      id: 'profile_name',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <Link
              state={{ ...row }}
              to={getPath('dpr.update', { id: row?.id, name: row?.profile_name })}
              className='d-block'
              id='create-button'
            >
              <span className='d-block fw-bold'>{row?.profile_name}</span>
            </Link>
          </div>
        </div>
      )
    },
    {
      name: FM('project-name'),
      sortable: true,
      id: 'project',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            {/* <Link
              state={{ ...row }}
              to={getPath('dpr.update', { id: row?.id, name: row?.profile_name })}
              className='d-block'
              id='create-button'
            > */}
            <span className='d-block fw-bold'>{row?.project?.name}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: FM('vendor-name'),
      sortable: true,
      id: 'vendor',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            {/* <Link
              state={{ ...row }}
              to={getPath('dpr.update', { id: row?.id, name: row?.profile_name })}
              className='d-block'
              id='create-button'
            > */}
            <span className='d-block fw-bold'>{row?.vendor?.name}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: FM('workpack-name'),
      sortable: true,
      id: 'work_package',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold'>{row?.work_package?.name}</span>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('status')}</>,
      sortable: true,
      id: 'status',
      cell: (row) => {
        return (
          <>
            {`${row?.status}` === `${1}` ? (
              <Badge color={'light-success'} pill>
                <>{FM('activated')}</>
              </Badge>
            ) : (
              <Badge color={'light-danger'} pill>
                <>{FM('deactivated')}</>
              </Badge>
            )}
          </>
        )
      }
    },
    {
      name: <>{FM('action')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            {/* <Hide IF={row?.id === users?.id}> */}
            <DropDownMenu
              direction='down'
              component={
                <MoreVertical color={colors?.primary?.main} size={IconSizes?.MenuVertical} />
              }
              options={[
                {
                  IF: Permissions.dprConfig,
                  icon: <Edit size={14} />,
                  state: row,
                  to: { pathname: getPath('dpr.config.update', { id: row?.id }) },
                  name: FM('edit')
                },
                {
                  IF: row?.status === 2,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<CheckSquare size={14} />}
                      onDropdown
                      eventId={`item-active-${row?.id}`}
                      text={FM('are-you-sure')}
                      title={FM('activate-item-name', { name: row?.profile_name })}
                      color='text-warning'
                      onClickYes={() => handleAction([row?.id], 'active', `item-active-${row?.id}`)}
                      onSuccessEvent={(e: any) => {
                        reloadData()
                      }}
                      className=''
                      id={`grid-active-selected`}
                    >
                      {FM('activate')}
                    </ConfirmAlert>
                  )
                },
                {
                  IF: row?.status === 1,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<MinusCircle size={14} />}
                      onDropdown
                      eventId={`item-inactive-${row?.id}`}
                      text={FM('are-you-sure')}
                      title={FM('deactivate-item-name', { name: row?.profile_name })}
                      color='text-warning'
                      onClickYes={() =>
                        handleAction([row?.id], 'inactive', `item-inactive-${row?.id}`)
                      }
                      onSuccessEvent={(e: any) => {
                        reloadData()
                      }}
                      className=''
                      id={`grid-inactive-selected`}
                    >
                      {FM('deactivate')}
                    </ConfirmAlert>
                  )
                }
                // {
                //   IF: Permissions.interfaceDelete,
                //   noWrap: true,
                //   name: (
                //     <ConfirmAlert
                //       menuIcon={<Trash2 size={14} />}
                //       onDropdown
                //       eventId={`delete-item-${row?.id}`}
                //       item={row}
                //       title={truncateText(`${row?.profile_name}`, 50)}
                //       color='text-warning'
                //       onClickYes={() => handleDelete(row?.id, `delete-item-${row?.id}`)}
                //       onSuccessEvent={(e: any) => {
                //         reloadData()
                //       }}
                //       className=''
                //       id={`grid-delete-${row?.id}`}
                //     >
                //       {FM('delete')}
                //     </ConfirmAlert>
                //   )
                // }
              ]}
            />
            {/* </Hide> */}
          </div>
        )
      }
    }
  ]

  const handleSort = (column: any, dir: string) => {
    setState({
      filterData: {
        ...state.filterData,
        sort: {
          column: column?.id,
          dir:
            originalArgs?.jsonData?.sort?.column === column?.id
              ? originalArgs?.jsonData?.sort?.dir === 'asc'
                ? 'desc'
                : 'asc'
              : dir
        }
      }
    })
  }

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
      <Header icon={<HardDrive size='25' />} title={FM('dpr-management')}>
        <ButtonGroup color='dark'>
          <LoadingButton
            title={FM('reload')}
            loading={isLoading}
            size='sm'
            color='secondary'
            onClick={reloadData}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
          <BsTooltip<ButtonProps>
            Tag={Button}
            onClick={() =>
              setState({
                configFilter: true
              })
            }
            size='sm'
            color='dark'
            title={FM('filter')}
          >
            <Sliders size='14' />
          </BsTooltip>
        </ButtonGroup>
      </Header>
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
                <Show IF={isValid(user)}>
                  <FormGroupCustom
                    label={FM('vendor')}
                    name={'vendor_id'}
                    type={'select'}
                    className='mb-2'
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
                    rules={{
                      required: true
                    }}
                  />
                </Show>
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
                  rules={{ required: true }}
                />
              </Col>
              <Show IF={Permissions?.dprConfig}>
                <Col sm='3' className=''>
                  <LoadingButton
                    loading={result.isLoading}
                    type='submit'
                    className=''
                    color='primary'
                  >
                    <>{FM('create')}</>
                  </LoadingButton>
                </Col>
              </Show>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <Show IF={Permissions.configBrowseAdmin}>
        <CustomDataTable<any>
          initialPerPage={40}
          isLoading={isLoading}
          onSort={handleSort}
          defaultSortField={originalArgs?.jsonData?.sort}
          columns={columns}
          paginatedData={data}
          handlePaginationAndSearch={handlePageChange}
        />
      </Show>
    </>
  )
}

export default Config
