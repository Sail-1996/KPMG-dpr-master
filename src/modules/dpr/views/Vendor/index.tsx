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
  Sliders,
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
import { DPR } from '@src/utility/types/typeDPR'
import { emitAlertStatus, formatDate, truncateText } from '@src/utility/Utils'
import { TableColumn } from 'react-data-table-component'
import {
  useDeleteVendorByIdMutation,
  useLoadVendorActionMutation,
  useLoadVendorMutation
} from '../../redux/RTKQuery/VendorRTK'
import { Permissions } from '@src/utility/Permissions'
import Show from '@src/utility/Show'
import useUser from '@hooks/useUser'
import Hide from '@src/utility/Hide'

interface States {
  id?: any
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  showModal?: boolean
  rowData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
  fromVendor?: boolean | undefined
  filterData?: DPR | any
}

function Vendor() {
  const reloadID = new Date().getTime()
  const location: any = useLocation()
  const notification = location?.state?.notification
  const user = useUser()
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    showModal: false,
    rowData: {},
    per_page_record: 40,
    search: '',
    lastRefresh: new Date().getTime(),
    fromVendor: true,
    filterData: null
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadVendor, { data, originalArgs, isLoading, isSuccess }] = useLoadVendorMutation()
  const [deleteVendor, resultDelete] = useDeleteVendorByIdMutation()
  const [actionVendor, resultAction] = useLoadVendorActionMutation()
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }
  useEffect(() => {
    loadVendor({
      jsonData: {
        vendor_id: user?.vendor_id ? user?.vendor_id : null,
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
      deleteVendor({
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
      actionVendor({
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

  // useEffect(() => {
  //   if (notification?.data_id && notification?.type === 'Vendor') {
  //     setState({
  //       id: notification?.data_id
  //     })
  //   }
  // }, [notification])

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
    // {
    //   name: <>{FM('mobile-number')}</>,
    //   cell: (row) => <span className='d-block fw-bold text-wrap'>{row?.mobile_number}</span>
    // },
    // {
    //   name: <>{FM('email')}</>,
    //   cell: (row) => (
    //     <span className='d-flex fw-bold text-wrap'>{truncateText(row?.email, 15)}</span>
    //   )
    // },
    // {
    //   name: FM('projectId'),

    //   cell: (row) => (
    //     <div className='d-flex align-items-center'>
    //       <div className='user-info'>
    //         <span className='d-block fw-bold text-primary text-capitalize'>{row?.projectId}</span>
    //       </div>
    //     </div>
    //   )
    // },
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
            <Hide IF={row?.id === user?.vendor_id}>
              <DropDownMenu
                direction='up'
                component={
                  <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                }
                options={[
                  {
                    IF: Permissions.vendorEdit,
                    icon: <Edit size={14} />,
                    state: row,
                    to: {
                      pathname: getPath('dpr.vendor.update', { id: row?.id })
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
                  //   IF: Permissions.vendorDelete,
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
            </Hide>
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
      <Header icon={<Sliders size='25' />} title={FM('vendor')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.vendorCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.vendor.create')}
              state={{
                fromVendor: state?.fromVendor
              }}
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
export default Vendor
