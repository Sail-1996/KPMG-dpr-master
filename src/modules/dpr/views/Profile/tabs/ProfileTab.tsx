import ListAltIcon from '@mui/icons-material/ListAlt'
import { UserType } from '@src/utility/Const'
import useUser from '@src/utility/hooks/useUser'
import useUserType from '@src/utility/hooks/useUserType'
import Show from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import { FM } from '@src/utility/Utils'
import { Fragment, useReducer } from 'react'
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

type States = {
  active?: string
  addOffer?: boolean
}
const ProfileTab = () => {
  const initState: States = {
    active: '1',
    addOffer: false
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const toggleTab = (tab: any) => {
    if (state?.active !== tab) {
      setState({ active: tab })
    }
  }

  // const userType = useUserType()
  const user = useUser()
  return (
    <Fragment>
      <Card>
        <CardHeader className='p-1 border-bottom'>
          <div className='flex-1'>
            <Row className='d-flex justify-content-between aligned-items-center'>
              <Col md='11' className=''>
                <Nav pills className={`mb-0 flex-column flex-sm-row`}>
                  <NavItem>
                    <NavLink active={state.active === '1'} onClick={() => toggleTab('1')}>
                      <ListAltIcon className='font-medium-3  me-50' />
                      <span className='fw-bold'>
                        <>{FM('activity')}</>
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </div>
        </CardHeader>
        <CardBody className='p-0'>
          <TabContent activeTab={state.active}>
            <TabPane tabId='1'></TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ProfileTab
