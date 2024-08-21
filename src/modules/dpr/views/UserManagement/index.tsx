import { useContext, useEffect, useReducer } from 'react'

import {
  BarChart2,
  CheckSquare,
  Edit,
  MinusCircle,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  Trash2,
  UserPlus
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps } from 'reactstrap'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import { Link } from 'react-router-dom'

import { getPath } from '@src/router/RouteHelper'
import { IconSizes } from '@src/utility/Const'
import { FM, isValid } from '@src/utility/Utils'
import ConfirmAlert from '@src/utility/hooks/ConfirmAlert'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import DropDownMenu from '@src/modules/common/components/dropdown'
import Header from '@src/modules/common/components/header'

import { stateReducer } from '@src/utility/stateReducer'

import { TableColumn } from 'react-data-table-component'
import BsTooltip from '@src/modules/common/components/tooltip'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { useDispatch } from 'react-redux'
import Hide from '@src/utility/Hide'
import useUser from '@src/utility/hooks/useUser'
import { emitAlertStatus, getUserData, truncateText } from '@src/utility/Utils'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import UserFilter from './UserFilter'
import {
  useDeleteUserByIdMutation,
  useLoadUserActionMutation,
  useLoadUserMutation
} from '../../redux/RTKQuery/UserRTK'
import { DPR } from '@src/utility/types/typeDPR'
import { Permissions } from '@src/utility/Permissions'
import Show, { Can } from '@src/utility/Show'
interface States {
  lastRefresh?: any
  page?: any
  per_page_record?: any
  employeeFilter?: boolean
  filterData?: DPR | any
  search?: any
  reload?: any
}
function UserManagement() {
  const dispatch = useDispatch()
  const user = getUserData()
  const users = useUser()
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    lastRefresh: new Date().getTime(),
    page: 1,
    per_page_record: 40,
    employeeFilter: false,
    search: undefined,
    filterData: null
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [deleteUser, resultDelete] = useDeleteUserByIdMutation()
  const [actionUser, resultAction] = useLoadUserActionMutation()
  const [loadUser, { data, originalArgs, isLoading }] = useLoadUserMutation()

  useEffect(() => {
    loadUser({
      jsonData: {
        vendor_id: user?.vendor_id ? user?.vendor_id : null,
        name: isValid(state?.search) ? state.search : state?.filterData?.name,
        ...state?.filterData
      },
      page: isValid(state?.search) ? 1 : state?.page,
      per_page_record: state?.per_page_record
    })
  }, [
    state?.lastRefresh,
    resultDelete,
    state?.search,
    state?.page,
    state?.per_page_record,
    state?.filterData
  ])

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }

  const reloadData = () => {
    setState({
      page: 1,
      search: '',
      lastRefresh: new Date().getTime()
    })
  }

  const handleActionsDelete = (id?: any, ids?: any, action?: any, eventId?: any) => {
    // log('id', id)
    if (isValid(id)) {
      // delete single
      deleteUser({
        eventId,
        id,
        originalArgs: resultDelete?.originalArgs
      })
      actionUser({
        eventId,
        id,
        originalArgs: resultAction?.originalArgs
      })
    }
  }
  useEffect(() => {
    if ((resultDelete.status = QueryStatus?.fulfilled) && resultDelete?.isLoading === false) {
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
      actionUser({
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
    if (resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
      }
    }
  }, [resultDelete])

  const handleActions = (id?: any, ids?: any, action?: any, eventId?: any) => {
    if (isValid(id)) {
      // delete single
      actionUser({
        eventId,
        id,
        originalArgs: resultAction?.originalArgs
      })
    } else {
      actionUser({
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

  const options: TableDropDownOptions = (selectedRows) => [
    // {
    //   IF: Permissions.userDelete,
    //   noWrap: true,
    //   name: (
    //     <ConfirmAlert
    //       menuIcon={<Trash2 size={14} />}
    //       onDropdown
    //       eventId={`item-delete`}
    //       text={FM('are-you-sure')}
    //       title={FM('delete-selected-count', { count: selectedRows?.selectedCount })}
    //       color='text-warning'
    //       onClickYes={() => handleActions(null, selectedRows?.ids, 'delete', 'item-delete')}
    //       onSuccessEvent={(e: any) => {
    //         reloadData()
    //       }}
    //       className=''
    //       id={`grid-delete-selected`}
    //     >
    //       {FM('delete')}
    //     </ConfirmAlert>
    //   )
    // },
    {
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<CheckSquare size={14} />}
          onDropdown
          eventId={`item-active`}
          text={FM('are-you-sure')}
          title={FM('active-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleActions(null, selectedRows?.ids, 'active', 'item-active')}
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
      noWrap: true,
      name: (
        <ConfirmAlert
          menuIcon={<MinusCircle size={14} />}
          onDropdown
          eventId={`item-inactive`}
          text={FM('are-you-sure')}
          title={FM('inactive-selected-count', { count: selectedRows?.selectedCount })}
          color='text-warning'
          onClickYes={() => handleActions(null, selectedRows?.ids, 'inactive', 'item-inactive')}
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
  ]

  // handle sort
  // const handleSort = (column: any, dir: string) => {
  //   setState({
  //     filterData: {
  //       ...state.filterData,
  //       sort: { column: column?.id, dir }
  //     }
  //   })
  // }

  // handle sort
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

  const columns: TableColumn<DPR>[] = [
    {
      name: '#',
      // maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: <>{FM('name')}</>,
      sortable: true,
      id: 'name',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <Link
              state={{ row }}
              to={getPath('dpr.user.update', { id: row?.id })}
              className='d-block'
              id='create-button'
            >
              <span className='d-block fw-bold text-wrap'>{truncateText(row?.name, 25)}</span>
            </Link>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('mobile-number')}</>,
      sortable: true,
      id: 'mobile_number',
      cell: (row) => <span className='d-block fw-bold text-wrap'>{row?.mobile_number}</span>
    },
    {
      name: <>{FM('email')}</>,
      sortable: true,
      id: 'email',
      cell: (row) => (
        <span className='d-flex fw-bold text-wrap'>{truncateText(row?.email, 15)}</span>
      )
    },
    {
      name: <>{FM('role')}</>,
      sortable: true,
      id: 'role',
      cell: (row) => <span className='d-block fw-bold text-wrap'>{row?.role?.se_name}</span>
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
            <Hide IF={row?.id === users?.id}>
              <DropDownMenu
                direction='down'
                component={
                  <MoreVertical color={colors?.primary?.main} size={IconSizes?.MenuVertical} />
                }
                options={[
                  {
                    IF: Permissions.userEdit,
                    icon: <Edit size={14} />,
                    state: row,
                    to: { pathname: getPath('dpr.user.update', { id: row?.id }) },
                    name: FM('edit')
                  },
                  {
                    IF: row?.status === 0,
                    noWrap: true,
                    name: (
                      <ConfirmAlert
                        menuIcon={<CheckSquare size={14} />}
                        onDropdown
                        eventId={`item-active-${row?.id}`}
                        text={FM('are-you-sure')}
                        title={FM('activate-item-name', { name: row?.name })}
                        color='text-warning'
                        onClickYes={() =>
                          handleAction([row?.id], 'active', `item-active-${row?.id}`)
                        }
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
                        title={FM('deactivate-item-name', { name: row?.name })}
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
                  //   noWrap: true,
                  //   name: (
                  //     <ConfirmAlert
                  //       menuIcon={<Trash2 size={14} />}
                  //       onDropdown
                  //       eventId={`delete-item-${row?.id}`}
                  //       item={row}
                  //       title={FM('delete-item-name', { name: row?.name })}
                  //       color='text-warning'
                  //       onClickYes={() =>
                  //         handleActionsDelete(row?.id, null, null, `delete-item-${row?.id}`)
                  //       }
                  //       onSuccessEvent={() =>
                  //         setState({
                  //           search: '',
                  //           page: 1
                  //         })
                  //       }
                  //       className=''
                  //       id={`grid-delete-${row?.id}`}
                  //     >
                  //       {FM('delete')}
                  //     </ConfirmAlert>
                  //   )
                  // }
                ]}
              />
            </Hide>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <UserFilter
        show={state?.employeeFilter}
        filterData={state?.filterData}
        setFilterData={(e: any) => setState({ filterData: e, page: 1 })}
        handleFilterModal={() => {
          setState({
            employeeFilter: false
          })
        }}
      />
      <Header
        icon={<UserPlus size='25' />}
        title={user?.user_type_id === 1 ? FM('user') : FM('user')}
      >
        <ButtonGroup color='dark'>
          <Show IF={Permissions.userCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.user.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>
          <BsTooltip<ButtonProps>
            Tag={Button}
            onClick={() =>
              setState({
                employeeFilter: true
              })
            }
            size='sm'
            color='secondary'
            title={FM('filter')}
          >
            <Sliders size='14' />
          </BsTooltip>

          <LoadingButton
            loading={isLoading}
            onClick={reloadData}
            size='sm'
            color='dark'
            tooltip={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<DPR>
        key={state.lastRefresh}
        initialPerPage={40}
        options={options}
        onSort={handleSort}
        defaultSortField={originalArgs?.jsonData?.sort}
        isLoading={isLoading}
        columns={columns}
        paginatedData={data}
        selectableRows
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}

export default UserManagement
