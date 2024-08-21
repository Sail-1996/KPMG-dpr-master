import { useContext, useEffect, useReducer } from 'react'

import { ThemeColors } from '@src/utility/context/ThemeColors'
import {
  Activity,
  BarChart2,
  CheckSquare,
  Edit,
  MinusCircle,
  MoreVertical,
  Plus,
  RefreshCcw
} from 'react-feather'
import { Badge, Button, ButtonGroup, ButtonProps, DropdownItem } from 'reactstrap'

import { IconSizes } from '@src/utility/Const'
import { FM, isValid, isValidArray } from '@src/utility/Utils'

import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import DropDownMenu from '@src/modules/common/components/dropdown'
import Header from '@src/modules/common/components/header'
import { emitAlertStatus, formatDate, getUserData, truncateText } from '@src/utility/Utils'
import { stateReducer } from '@src/utility/stateReducer'

import { TableColumn } from 'react-data-table-component'

import BsTooltip from '@src/modules/common/components/tooltip'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'
import { getPath } from '@src/router/RouteHelper'
import { Permissions } from '@src/utility/Permissions'
import Show from '@src/utility/Show'
import ConfirmAlert from '@src/utility/hooks/ConfirmAlert'
import { DPR } from '@src/utility/types/typeDPR'
import {
  useDeleteRoleByIdMutation,
  useLoadRoleActionMutation,
  useLoadRoleMutation
} from '../../redux/RTKQuery/RoleRTK'
interface States {
  page?: any
  per_page_record?: any
  search?: any
  lastRefresh?: any
  reload?: any
  isAddingNewData?: boolean
  isRemoving?: boolean
  filterData?: DPR | any
}
function Roles() {
  const { colors } = useContext(ThemeColors)

  const initState: States = {
    page: 1,
    per_page_record: 40,
    lastRefresh: new Date().getTime(),
    search: undefined,
    filterData: null
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const user = getUserData()
  const [actionRole, resultAction] = useLoadRoleActionMutation()
  const [deleteRole, resultDelete] = useDeleteRoleByIdMutation()
  const [loadRolePer, { data, isLoading, originalArgs }] = useLoadRoleMutation()

  useEffect(() => {
    loadRolePer({
      jsonData: {
        se_name: isValid(state?.search) ? state.search : state?.filterData?.se_name,
        ...state?.filterData,
        store_id: user?.store_id,
        user_type_id: user?.user_type_id
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state.page, state.per_page_record, state.lastRefresh, state?.search, state?.filterData])
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }

  const reloadData = () => {
    setState({
      page: 1,
      lastRefresh: new Date().getTime()
    })
  }

  const handleSingleDelete = (id: any) => {
    deleteRole({ id, originalArgs: resultDelete.originalArgs })
  }
  useEffect(() => {
    if (resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        setState({ isRemoving: true })
        // refetch()
        emitAlertStatus('success', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, `delete-item-${resultDelete?.originalArgs?.id}`)
      }
    }
  }, [resultDelete])

  const handleAction = (ids?: any, action?: any, eventId?: any) => {
    // log('id', id)
    if (isValid(ids)) {
      // delete single
      actionRole({
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

  const columns: TableColumn<DPR>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        // eslint-disable-next-line no-mixed-operators
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('name'),
      minWidth: '250px',
      sortable: true,
      id: 'name',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold'>{truncateText(row?.se_name, 30)}</span>
            {/* </Link> */}
          </div>
        </div>
      )
    },
    {
      name: FM('no-of-permission'),

      minWidth: '250px',
      sortable: true,
      id: 'permissions',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info ms-1'>
            <span className='d-block fw-bold'>
              <Badge color='light-success'>
                {isValidArray(row.permissions) ? row.permissions.length : '0'} {FM('permissions')}
              </Badge>
            </span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('created-at')}</>,
      minWidth: '150px',
      sortable: true,
      id: 'created_at',
      cell: (row) => {
        return (
          <Badge color='light-primary' pill>
            {formatDate(row?.created_at, 'DD MMM YYYY')}
          </Badge>
        )
      }
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
      name: <>{FM('actions')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='start'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  IF: Permissions?.roleEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: { pathname: getPath('dpr.role.update', { id: row?.id }) },
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
                      title={FM('activate-item-name', { name: row?.name })}
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
              ]}
            />
          </div>
        )
      }
    }
  ]

  const options: TableDropDownOptions = (selectedRows) => [
    {
      IF: Permissions.roleDelete,
      noWrap: true,
      name: (
        <DropdownItem
          onClick={() => {}}
          tag={'span'}
          className='dropdown-item d-flex align-items-center'
        >
          <>
            <Activity size={16} className='me-1' />
            {FM('delete')} ({selectedRows?.selectedCount})
          </>
        </DropdownItem>
      )
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
      <Header icon={<BarChart2 size='25' />} title={FM('role')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions?.roleCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.role.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>
          <BsTooltip<ButtonProps>
            Tag={Button}
            size='sm'
            color='dark'
            onClick={reloadData}
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </BsTooltip>
        </ButtonGroup>
      </Header>
      <CustomDataTable<DPR>
        key={state.lastRefresh}
        initialPerPage={40}
        isLoading={isLoading}
        onSort={handleSort}
        defaultSortField={originalArgs?.jsonData?.sort}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Roles
