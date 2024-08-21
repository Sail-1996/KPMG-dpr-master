/* eslint-disable no-mixed-operators */
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useReducer } from 'react'
import { Edit, Layers, MoreVertical, Plus, RefreshCcw, Rss, Trash2 } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { ButtonGroup } from 'reactstrap'

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
  useDeleteOrganizationByIdMutation,
  useLoadOrganizationMutation
} from '../../redux/RTKQuery/OrganizationRTK'
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
}
function Organization() {
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
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const [loadOrganization, { data, isLoading, isSuccess }] = useLoadOrganizationMutation()
  const [deleteOrganization, resultDelete] = useDeleteOrganizationByIdMutation()
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }
  useEffect(() => {
    loadOrganization({
      jsonData: { name: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.search, state?.page, state?.per_page_record, state.lastRefresh])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const handleDelete = (id?: any, eventId?: any) => {
    if (isValid(id)) {
      deleteOrganization({
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

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>{row?.name}</span>
          </div>
        </div>
      )
    },
    {
      name: FM('created-at'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold'>{formatDate(row?.created_at, 'YYYY-MM-DD')}</span>
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
                  IF: Permissions.organizationsEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  to: {
                    pathname: getPath('dpr.organization.update', { id: row?.id })
                  },
                  name: FM('edit')
                }
                // {
                //   IF: Permissions.organizationsDelete,
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

  return (
    <>
      <Header icon={<Layers size='25' />} title={FM('organization')}>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.organizationsCreate}>
            <TooltipLink
              title={<>{FM('create-new')}</>}
              to={getPath('dpr.organization.create')}
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
        hideHeader
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Organization
