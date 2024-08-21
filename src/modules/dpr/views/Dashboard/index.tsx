// ** React Imports
import { Fragment, useContext, useEffect, useReducer } from 'react'

// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'

// ** Context
import StorefrontIcon from '@mui/icons-material/Storefront'
import { ThemeColors } from '@src/utility/context/ThemeColors'
// ** Styles
import useUserType from '@hooks/useUserType'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StatsHorizontal from '@src/@core/components/widgets/stats/StatsHorizontal'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import { TableFormData } from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useLoadDashboardMutation } from '@src/modules/dpr/redux/RTKQuery/DashboardRTK'
import useUser from '@src/utility/hooks/useUser'
import { stateReducer } from '@src/utility/stateReducer'
import { abbreviateNumber, FM, log } from '@src/utility/Utils'
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/charts/apex-charts.scss'
import { Database, RefreshCcw, Server, Sliders, Upload, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import { getPath } from '@src/router/RouteHelper'
import DprUploadWiseGraph from './DprUploadWiseGraph'
import ManpowerGraph from './ManpowerGraph'
import Show, { Can } from '@src/utility/Show'
import { Permissions } from '@src/utility/Permissions'
interface States {
  lastStoreRefresh?: any
  lastRefresh?: any
  reportData?: any
  page?: any
  per_page_record?: any
  search?: any
  filterData?: any
}

const Dashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)
  const project = Can(Permissions.projectBrowse)
  const vendor = Can(Permissions.vendorBrowse)
  const workpackage = Can(Permissions.workpackBrowse)
  const userBrowse = Can(Permissions.userBrowse)

  const userType = useUserType()
  const user = useUser()
  // ** vars
  const trackBgColor = '#e9ecef'
  const initState: States = {
    page: 1,
    reportData: [],
    per_page_record: 30,
    lastStoreRefresh: new Date().getTime(),
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [loadDashboard, result] = useLoadDashboardMutation()

  const handlePageChange = (e: TableFormData) => {
    log(e)
    setState({ ...e })
  }

  useEffect(() => {
    loadDashboard({
      //   jsonData: { name: state?.search },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [state?.lastRefresh, state?.search, state?.page, state?.per_page_record])

  useEffect(() => {
    if (result?.isSuccess) {
      setState({
        reportData: result?.data?.data
      })
    }
  }, [result])

  // admin
  return (
    <Fragment>
      <Header title={FM('dashboard')}>
        <LoadingButton
          loading={result.isLoading}
          onClick={() => {
            setState({
              lastRefresh: new Date().getTime()
            })
          }}
          size='sm'
          color='dark'
          title={FM('reload')}
        >
          <RefreshCcw size='14' />
        </LoadingButton>
      </Header>
      {result?.isLoading ? (
        <div id='dashboard-dpr'>
          <Row className='match-height'>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
          </Row>
          <Row className='match-height mt-2'>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
          </Row>
          <Row className='match-height mt-2'>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
          </Row>
          <Row className='match-height mt-2'>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
            <Col md='4'>
              <Shimmer height={'100px'} />
            </Col>
          </Row>
        </div>
      ) : (
        <div id='dashboard-dpr'>
          <Row className='match-height'>
            <Col md='4'>
              <Link
                to={project ? getPath('dpr.project') : '#'}
                onClick={(e) => {
                  if (!project) {
                    e.preventDefault()
                  }
                }}
              >
                <StatsHorizontal
                  icon={<Server />}
                  color='success'
                  stats={abbreviateNumber(state?.reportData?.totalProject)}
                  statTitle={FM('total-project')}
                />
              </Link>
            </Col>
            <Show IF={user?.roles?.name === 'Admin'}>
              <Col md='4'>
                <Link
                  to={vendor ? getPath('dpr.vendor') : '#'}
                  onClick={(e) => {
                    if (!vendor) {
                      e.preventDefault()
                    }
                  }}
                >
                  <StatsHorizontal
                    icon={<Sliders />}
                    color='warning'
                    stats={abbreviateNumber(state?.reportData?.totalVendor)}
                    statTitle={FM('total-vendor')}
                  />
                </Link>
              </Col>
            </Show>

            <Col md='4'>
              <Link
                to={workpackage ? getPath('dpr.workpackage') : '#'}
                onClick={(e) => {
                  if (!workpackage) {
                    e.preventDefault()
                  }
                }}
              >
                <StatsHorizontal
                  icon={<Database />}
                  color='warning'
                  stats={abbreviateNumber(state?.reportData?.TotalWorkPackage)}
                  statTitle={FM('total-work-package')}
                />
              </Link>
            </Col>

            <Col md='4'>
              <Link
                to={userBrowse ? getPath('dpr.user') : '#'}
                onClick={(e) => {
                  if (!userBrowse) {
                    e.preventDefault()
                  }
                }}
              >
                <StatsHorizontal
                  icon={<Users />}
                  color='primary'
                  stats={abbreviateNumber(state?.reportData?.userCount)}
                  statTitle={FM('user-count')}
                />
              </Link>
            </Col>

            <Col md='4'>
              <StatsHorizontal
                icon={<Upload />}
                color='primary'
                className='text-primary'
                stats={abbreviateNumber(state?.reportData?.dprUploads)}
                statTitle={FM('dpr-upload-count-day')}
              />
            </Col>
          </Row>
          <Row>
            <Col md='12'>
              <DprUploadWiseGraph />
            </Col>
            <Col md='12'>
              <ManpowerGraph />
            </Col>
          </Row>
        </div>
      )}
    </Fragment>
  )
}

export default Dashboard
