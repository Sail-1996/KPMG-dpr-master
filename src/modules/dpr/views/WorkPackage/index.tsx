/* eslint-disable no-mixed-operators */
import { useContext, useEffect, useReducer } from 'react'
import {
  Activity,
  AlignJustify,
  CheckSquare,
  Database,
  Edit,
  MinusCircle,
  MoreVertical,
  Plus,
  RefreshCcw,
  Rss,
  Send,
  Trash2
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import { Badge, ButtonGroup, DropdownItem } from 'reactstrap'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import { FM, isValid } from '@src/utility/Utils'
import { stateReducer } from '@src/utility/stateReducer'
import CustomDataTable, {
  TableDropDownOptions,
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { TableColumn } from 'react-data-table-component'
import { getPath } from '@src/router/RouteHelper'
import { IconSizes, sendType } from '@src/utility/Const'
import ConfirmAlert from '@src/utility/hooks/ConfirmAlert'
import { emitAlertStatus, formatDate, getKeyByValue, truncateText } from '@src/utility/Utils'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import DropDownMenu from '@src/modules/common/components/dropdown'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'
// import { PromotionParamsType } from '../PromotionTemplate/PromotionTemplateForm'
// import PromotionDetailModal from './PromotionDetailModal'
// import PromotionSendModal from './PromotionSendModal'
import Show from '@src/utility/Show'
import {
  useDeleteWorkPackageByIdMutation,
  useLoadWorkPackageActionMutation,
  useLoadWorkPackageMutation
} from '../../redux/RTKQuery/WorkPackageRTK'
import { DPR } from '@src/utility/types/typeDPR'
import { Permissions } from '@src/utility/Permissions'

interface States {
  filterData?: DPR | any
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  showModal?: boolean
  rowData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
  sort?: any
}
function WorkPackage() {
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
    lastRefresh: new Date().getTime(),
    filterData: null
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadWorkPackage, { data, isLoading, isSuccess, originalArgs }] =
    useLoadWorkPackageMutation()
  const [deleteWorkPackage, resultDelete] = useDeleteWorkPackageByIdMutation()
  const [actionWorkPackage, resultAction] = useLoadWorkPackageActionMutation()
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }
  useEffect(() => {
    loadWorkPackage({
      jsonData: {
        name: isValid(state?.search) ? state.search : state?.filterData?.name,
        ...state?.filterData
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.search, state?.page, state?.per_page_record, state?.lastRefresh, state?.filterData])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const handleDelete = (id?: any, eventId?: any) => {
    if (isValid(id)) {
      deleteWorkPackage({
        id,
        eventId,
        originalArgs: resultDelete?.originalArgs
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
      actionWorkPackage({
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
      name: FM('workPackId'),
      sortable: true,
      id: 'workPackId',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>{row?.workPackId}</span>
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
      name: FM('unit-of-measure'),
      sortable: true,
      id: 'unit_of_measure',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>
              {row?.unit_of_measure}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('man-power-type'),
      sortable: true,
      id: 'man_power_type',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>
              {row?.man_power_type}
            </span>
          </div>
        </div>
      )
    },
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
                  IF: Permissions.workpackEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('dpr.workpackage.update', { id: row?.id })
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
                //   IF: Permissions.workpackDelete,
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
      {/* <PromotionSendModal
        response={() => {
          setState({
            lastRefresh: new Date().getTime(),
            per_page_record: state.per_page_record,
            page: state.page
          })
        }}
        showModal={state.showModal}
        setShowModal={(e) =>
          setState({
            showModal: e
          })
        }
        edit={state.rowData}
        noView
      /> */}
      <Header icon={<Database size='25' />} title={FM('work-package')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.workpackCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.workpackage.create')}
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
export default WorkPackage
