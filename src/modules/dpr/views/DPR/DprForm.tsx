import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import Header from '@src/modules/common/components/header'
import Emitter from '@src/utility/Emitter'
import Hide from '@src/utility/Hide'
import { Permissions } from '@src/utility/Permissions'
import Show, { Can } from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { FM, isValid, log } from '@src/utility/Utils'
import { useEffect, useReducer } from 'react'
import { RefreshCcw } from 'react-feather'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap'
import { useLoadConfigDetailsByIdMutation } from '../../redux/RTKQuery/DprConfigRTK'
import { useLoadDPRByIdMutation } from '../../redux/RTKQuery/DPRRTK'
import Config from './tab/Config'
import Direct from './tab/Direct'
import Import from './tab/Import'
import Log from './tab/Log'
import Map from './tab/Map'

type States = {
  active?: string
  filterConfig?: boolean
  filterMap?: boolean
  filterImport?: boolean
  filterLog?: boolean
  filterDirect?: boolean
  loading?: boolean
  list?: any
  formData?: any
  refreshData?: any
}

const DprForn = () => {
  const initState: States = {
    active: '1',
    filterConfig: false,
    filterMap: false,
    filterImport: false,
    filterLog: false,
    filterDirect: false,
    loading: false,
    refreshData: new Date().getTime(),
    list: [],
    formData: {
      id: null,
      sheet_name: null,
      name: null,
      cell_value: null,
      row_position: null,
      row_new_position: null,
      configName: null
    }
  }
  const nav = useNavigate()
  const params = useParams()
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const sheetName = params?.name ?? ''
  const configName = params?.id ?? ''
  const loc: any = useLocation()

  const [getConfig, result] = useLoadConfigDetailsByIdMutation()

  const getConfigData: DPR | undefined = result?.data?.data

  const getDataDate = getConfigData?.dpr_import[0]?.data_date

  const dprConfigPermission = Can(Permissions.dprConfig)
  const dprMapPermission = Can(Permissions.mapEdit)
  const dprDirectPermission = Can(Permissions.directEdit)
  const dprImportPermission = Can(Permissions.importEdit)
  const dprLogPermission = Can(Permissions.logEdit)

  log(getDataDate, 'Config')

  useEffect(() => {
    if (isValid(params?.id)) {
      getConfig({
        id: params?.id
      })
    }
  }, [params?.id, state?.refreshData])

  const [getDPRMap, { data, isSuccess, isLoading }] = useLoadDPRByIdMutation()

  const getData: any = data?.data

  useEffect(() => {
    getDPRMap({ sheet_name: sheetName, dpr_config_id: configName })
  }, [sheetName, configName, state?.refreshData])

  useEffect(() => {
    Emitter.on('reloadLogs', () => {
      if (isValid(params?.id)) {
        getConfig({
          id: params?.id
        })
      }
    })

    return () => {
      Emitter.off('reloadLogs', () => {})
    }
  }, [params?.id])

  useEffect(() => {
    Emitter.on('reloadMap', () => {
      if (isValid(params?.id)) {
        getDPRMap({ sheet_name: sheetName, dpr_config_id: configName })
      }
    })

    return () => {
      Emitter.off('reloadMap', () => {})
    }
  }, [sheetName, configName, state?.refreshData])

  const toggleTab = (tab: any) => {
    if (state?.active !== tab) {
      setState({ active: tab })
    }
  }
  const toggleImport = () => {
    setState({ filterImport: !state.filterImport })
  }
  const toggleMap = () => {
    setState({ filterMap: !state.filterMap })
  }
  const toggleLog = () => {
    setState({ filterLog: !state.filterLog })
  }
  const toggleConfig = () => {
    setState({ filterConfig: !state.filterConfig })
  }
  const toggleDirect = () => {
    setState({ filterDirect: !state.filterDirect })
  }

  //   useEffect(() => {
  //     setState({
  //       active: loc?.state?.hideTab === true ? '3' : '1'
  //     })
  //   }, [loc?.state?.hideTab])

  useEffect(() => {
    let active = 1
    if (loc?.state?.hideTab === true) {
      if (dprDirectPermission) {
        active = 3
      } else if (dprImportPermission) {
        active = 4
      }
    } else {
      if (dprConfigPermission) {
        active = 1
      } else if (dprMapPermission) {
        active = 2
      } else if (dprLogPermission) {
        active = 5
      }
    }
    setState({
      active: active.toString()
    })
  }, [loc?.state?.hideTab])

  return (
    <>
      <Header onClickBack={() => nav(-1)} goBackTo title={sheetName.replaceAll('_', ' ')}>
        <Hide IF={loc?.state?.hideTab}>
          <LoadingButton
            loading={result?.isLoading}
            onClick={() => {
              setState({
                refreshData: new Date().getTime()
              })
            }}
            size='sm'
            color='dark'
            title={FM('reload')}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </Hide>
      </Header>
      <Card>
        <CardHeader className='p-1 border-bottom'>
          <div className='flex-1'>
            <Row className='d-flex justify-content-between aligned-items-center'>
              <Col md='' className=''>
                <Nav pills className={`mb-0 flex-column flex-sm-row`}>
                  <Hide IF={loc?.state?.hideTab}>
                    <Show IF={Permissions?.dprConfig}>
                      <NavItem>
                        <NavLink active={state.active === '1'} onClick={() => toggleTab('1')}>
                          <span className='fw-bold'>
                            <>{FM('dpr-config')}</>
                          </span>
                        </NavLink>
                      </NavItem>
                    </Show>
                    <Show IF={Permissions?.mapEdit}>
                      <NavItem>
                        <NavLink active={state.active === '2'} onClick={() => toggleTab('2')}>
                          <span className='fw-bold'>
                            <>{FM('dpr-map')}</>
                          </span>
                        </NavLink>
                      </NavItem>
                    </Show>
                  </Hide>
                  <Show IF={loc?.state?.hideTab}>
                    <Show IF={Permissions?.directEdit}>
                      <NavItem>
                        <NavLink active={state.active === '3'} onClick={() => toggleTab('3')}>
                          <span className='fw-bold'>
                            <>{FM('dpr-direct')}</>
                          </span>
                        </NavLink>
                      </NavItem>
                    </Show>
                    <Show IF={Permissions?.importEdit}>
                      <NavItem>
                        <NavLink active={state.active === '4'} onClick={() => toggleTab('4')}>
                          <span className='fw-bold'>
                            <>{FM('dpr-import')}</>
                          </span>
                        </NavLink>
                      </NavItem>
                    </Show>
                  </Show>
                  <Hide IF={loc?.state?.hideTab}>
                    <Show IF={Permissions?.logEdit}>
                      <NavItem>
                        <NavLink active={state.active === '5'} onClick={() => toggleTab('5')}>
                          <span className='fw-bold'>
                            <>{FM('dpr-log')}</>
                          </span>
                        </NavLink>
                      </NavItem>
                    </Show>
                  </Hide>
                </Nav>
              </Col>
            </Row>
          </div>
        </CardHeader>
        <CardBody className='p-0'>
          <TabContent activeTab={state.active}>
            <Show IF={Permissions?.dprConfig}>
              <TabPane tabId='1'>
                <Config
                  getConfigData={getConfigData}
                  filterConfig={state?.filterConfig}
                  closeForm={() => {
                    toggleConfig()
                  }}
                />
              </TabPane>
            </Show>
            <Show IF={Permissions?.mapEdit}>
              <TabPane tabId='2'>
                <Map
                  configName={params?.id}
                  sheetName={params?.name}
                  getData={getData}
                  filterMap={state?.filterMap}
                  closeForm={() => {
                    toggleMap()
                  }}
                />
              </TabPane>
            </Show>
            <Show IF={Permissions?.importEdit}>
              <TabPane tabId='4'>
                <Import
                  configName={params?.id}
                  sheetName={params?.name}
                  getData={getData}
                  getDataDate={getDataDate}
                  getConfigData={result?.data}
                  filterImport={state?.filterImport}
                  closeForm={() => {
                    toggleImport()
                  }}
                />
              </TabPane>
            </Show>
            <Show IF={Permissions?.directEdit}>
              <TabPane tabId='3'>
                <Direct
                  getData={getData}
                  getConfigData={result?.data}
                  getDataDate={getDataDate}
                  filterDirect={state?.filterDirect}
                  closeForm={() => {
                    toggleDirect()
                  }}
                />
              </TabPane>
            </Show>
            <Show IF={Permissions?.logEdit}>
              <TabPane tabId='5'>
                <Log
                  isLoading={result?.isLoading}
                  configName={params?.id}
                  sheetName={params?.name}
                  getConfigData={getConfigData}
                  resultData={result}
                  filterLog={state?.filterLog}
                  closeForm={() => {
                    toggleLog()
                  }}
                />
              </TabPane>
            </Show>
          </TabContent>
        </CardBody>
      </Card>
    </>
  )
}

export default DprForn
