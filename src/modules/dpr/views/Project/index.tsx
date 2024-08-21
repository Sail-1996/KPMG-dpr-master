/* eslint-disable no-mixed-operators */
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useReducer } from 'react'
import {
  CheckSquare,
  Edit,
  MinusCircle,
  MoreVertical,
  Plus,
  RefreshCcw,
  Rss,
  Server,
  Trash2
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import { Badge, ButtonGroup } from 'reactstrap'

import CustomDataTable, {
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'
import { stateReducer } from '@src/utility/stateReducer'
import { FM, isValid } from '@src/utility/Utils'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import DropDownMenu from '@src/modules/common/components/dropdown'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'
import { getPath } from '@src/router/RouteHelper'
import { IconSizes } from '@src/utility/Const'
import ConfirmAlert from '@src/utility/hooks/ConfirmAlert'
import { emitAlertStatus, formatDate, truncateText } from '@src/utility/Utils'
import { TableColumn } from 'react-data-table-component'
import { DPR } from '@src/utility/types/typeDPR'
import {
  useDeleteProjectByIdMutation,
  useLoadProjectActionMutation,
  useLoadProjectMutation
} from '../../redux/RTKQuery/ProjectRTK'
import Show from '@src/utility/Show'
import { Permissions } from '@src/utility/Permissions'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  showModal?: boolean
  rowData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
  filterData?: DPR | any
}
function Project() {
  const reloadID = new Date().getTime()
  const location: any = useLocation()
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    showModal: false,
    rowData: {},
    per_page_record: 40,
    search: '',
    filterData: null,
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadProject, { data, originalArgs, isLoading, isSuccess }] = useLoadProjectMutation()
  const [deleteProject, resultDelete] = useDeleteProjectByIdMutation()
  const [actionProject, resultAction] = useLoadProjectActionMutation()

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }
  useEffect(() => {
    loadProject({
      jsonData: {
        name: isValid(state?.search) ? state.search : state?.filterData?.name,
        ...state?.filterData
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.search, state?.page, state?.per_page_record, state.lastRefresh, state?.filterData])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const handleDelete = (id?: any, eventId?: any) => {
    if (isValid(id)) {
      loadProject({
        id,
        eventId
      })
    }
  }

  // delete item success
  useEffect(() => {
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
      actionProject({
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
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('name'),
      sortable: true,
      id: 'name',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>{row?.name}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('projectId'),
      sortable: true,
      id: 'projectId',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>{row?.projectId}</span>
          </div>
        </div>
      )
    },
    // {
    //   name: FM('description'),

    //   cell: (row) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info'>
    //         <span className='d-block fw-bold text-primary text-capitalize'>{row?.description}</span>
    //       </div>
    //     </div>
    //   )
    // },
    {
      name: FM('created-at'),
      sortable: true,
      id: 'created_at',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold'>{formatDate(row?.created_at, 'DD MMM YYYY')}</span>
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
      name: <>{FM('actions')}</>,
      allowOverflow: true,
      maxWidth: '10px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  IF: Permissions.projectEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('dpr.project.update', { id: row?.id })
                  },
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
                // {
                //   IF: Permissions.projectDelete,
                //   noWrap: true,
                //   name: (
                //     <ConfirmAlert
                //       menuIcon={<Trash2 size={14} />}
                //       onDropdown
                //       eventId={`delete-item-${row?.id}`}
                //       item={row}
                //       title={truncateText(`${row?.name}`, 50)}
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
      <Header icon={<Server size='25' />} title={FM('project')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.projectCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.project.create')}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </TooltipLink>
          </Show>
          <LoadingButton
            title={FM('reload')}
            loading={isLoading}
            size='sm'
            color='secondary'
            onClick={reloadData}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <CustomDataTable<DPR>
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
export default Project
