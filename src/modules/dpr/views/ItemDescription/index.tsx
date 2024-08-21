/* eslint-disable no-mixed-operators */
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useReducer } from 'react'
import { Edit, MoreVertical, Plus, RefreshCcw, Server } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { ButtonGroup } from 'reactstrap'

import CustomDataTable, {
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'
import { stateReducer } from '@src/utility/stateReducer'
import { FM, isValid } from '@src/utility/Utils'

import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import DropDownMenu from '@src/modules/common/components/dropdown'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'
import { getPath } from '@src/router/RouteHelper'
import { IconSizes } from '@src/utility/Const'
import { Permissions } from '@src/utility/Permissions'
import Show from '@src/utility/Show'
import { DPR } from '@src/utility/types/typeDPR'
import { emitAlertStatus, formatDate } from '@src/utility/Utils'
import { TableColumn } from 'react-data-table-component'
import {
  useDeleteItemDescByIdMutation,
  useLoadItemDescMutation
} from '../../redux/RTKQuery/ItemDescRTK'

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
function ItemDescription() {
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
  const [loadItem, { data, originalArgs, isLoading, isSuccess }] = useLoadItemDescMutation()
  const [deleteItem, resultDelete] = useDeleteItemDescByIdMutation()

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }
  useEffect(() => {
    loadItem({
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
      loadItem({
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

  const columns: TableColumn<DPR>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('title'),
      sortable: true,
      id: 'title',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>{row?.title}</span>
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
                  IF: Permissions.itemDescriptionEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('dpr.item.update', { id: row?.id })
                  },
                  name: FM('edit')
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
      <Header icon={<Server size='25' />} title={FM('item-description')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.itemDescriptionCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.item.create')}
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
export default ItemDescription
