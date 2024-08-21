/* eslint-disable no-mixed-operators */
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'

import CustomDataTable, {
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import { stateReducer } from '@src/utility/stateReducer'
import { FM } from '@src/utility/Utils'

import { DPR } from '@src/utility/types/typeDPR'
import { formatDate } from '@src/utility/Utils'
import { TableColumn } from 'react-data-table-component'
import { Download } from 'react-feather'
import BsTooltip from '@src/modules/common/components/tooltip'
import { Button, ButtonProps } from 'reactstrap'
import Emitter from '@src/utility/Emitter'

type theProps = {
  loading?: boolean
  filterTransaction?: boolean
  filterLog?: any
  closeForm: () => void
  sheetName?: any
  configName?: any
  getData?: any
  getConfigData?: any
  isLoading?: boolean
  resultData?: any
}
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
function Log(props: theProps) {
  const { colors } = useContext(ThemeColors)
  const params = useParams()
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

  const handlePageChange = (e: TableFormData) => {
    setState({ ...e })
  }

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const columns: TableColumn<DPR>[] = [
    {
      name: '#',
      maxWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('filename'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>
              {row?.original_import_file}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('data-date'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary text-capitalize'>
              {formatDate(row?.data_date, 'DD MMM YYYY')}
            </span>
          </div>
        </div>
      )
    },
    {
      name: FM('uploaded-date'),

      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold'>{formatDate(row?.created_at, 'DD MMM YYYY')}</span>
          </div>
        </div>
      )
    },
    {
      name: <>{FM('action')}</>,
      allowOverflow: true,
      cell: (row) => {
        return (
          <a href={row?.file_path} target='_blank'>
            <BsTooltip<ButtonProps> Tag={Button} size='sm' color='dark' title={FM('download')}>
              <Download size='15' />
            </BsTooltip>
          </a>
        )
      }
    }
  ]

  return (
    <>
      <CustomDataTable<DPR>
        initialPerPage={40}
        isLoading={props?.isLoading}
        hideHeader
        columns={columns}
        tableData={props?.getConfigData?.dpr_logs}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default Log
