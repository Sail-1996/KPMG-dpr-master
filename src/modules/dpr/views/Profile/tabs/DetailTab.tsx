import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { UserType } from '@src/utility/Const'
import { FM, isValid, log } from '@src/utility/Utils'
import useUserType from '@src/utility/hooks/useUserType'
import Show from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useGetProfileMutation } from '@src/modules/dpr/redux/RTKQuery/ProfileRTK'
import { DPR } from '@src/utility/types/typeDPR'

type centerProps = {
  lat: number
  lng: number
}
type addressProps = {
  lat: number
  lng: number
  state?: string | null
  country?: string | null
  city?: string | null
  zip_code?: string | null
  full_address?: string | null
}

interface States {
  category?: boolean
  subcategory?: boolean
  language?: any
  search?: any
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  zoom?: number
  center?: centerProps
  address?: addressProps
  list?: any
  active?: string
  formData?: DPR | any
}
const ProfileCard = ({ user = {}, loading = false }: { user: any; loading: boolean }) => {
  const userType = useUserType()
  const initState: States = {
    category: false,
    subcategory: false,
    ip: false,
    patient: false,
    loading: false,
    search: '',
    language: [],
    text: '',
    list: [],
    active: '1',
    zoom: 20,
    center: undefined,
    formData: {
      password: null,
      address: null,
      name: null,
      mobile_number: null,
      email: null
      // is_change_password: null
    }
  }
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>()

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [storeLoad, res] = useGetProfileMutation()

  useEffect(() => {
    if (isValid(user?.store_id)) {
      storeLoad({
        id: user?.store_id
      })
    }
  }, [user])

  log('userTab', user)
  const loginDetails = () => {
    let re = ''
    if (userType === UserType.Store) {
      re = FM('user')
    } else if (userType === UserType.AdminEmployee || user?.store_id === UserType.Admin) {
      re = FM('user')
    } else {
      re = FM('user')
    }
    return re
  }
  const getCurrentPositionLoacation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setState({ center: { lat, lng } })
        },
        () => {}
      )
    } else {
      log(
        'It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.'
      )
    }
  }

  useEffect(() => {
    if (isValid(user?.store_setting?.latitude) && isValid(user?.store_setting?.latitude)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = Number(user?.store_setting?.latitude)
            const lng = Number(user?.store_setting?.longitude)
            setState({ center: { lat, lng } })
          },
          () => {}
        )
      } else {
        log(
          'It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.'
        )
      }
    }
  }, [user])
  const AnyReactComponent = ({ lat, lng, text }: { text: any; lng?: number; lat?: number }) => (
    <>
      <div className='pin'></div>
      <div className='pulse'></div>
    </>
  )
  return (
    <>
      {!loading ? (
        <>
          <Card>
            <CardBody className=''>
              <h4 className='border-bottom  pb-1'>{loginDetails()}</h4>
              <Row className='align-items-start gy-2'>
                {/* <Col md='4'>
                  <span className='mb-0 text-dark fw-bolder'>{FM('admin-name')}</span>
                  <p className='mb-0 fw-bold text-secondary'>{user?.name ?? 'N/A'}</p>
                </Col>
                <Col md='4'>
                  <span className='h5 text-dark fw-bolder'>{FM('admin-email')}</span>
                  <p className='mb-0 fw-bold text-secondary'>{user?.email ?? 'N/A'}</p>
                </Col> */}
                <Col md='4'>
                  <span className='mb-0 text-dark fw-bolder'>{FM('name')}</span>
                  <p className='mb-0 fw-bold text-secondary'>
                    {user?.store_setting?.store_name ?? 'N/A'}
                  </p>
                </Col>
                <Col md='4'>
                  <span className='h5 text-dark fw-bolder'>{FM('email')}</span>
                  <p className='mb-0 fw-bold text-secondary'>
                    {user?.store_setting?.store_email ?? 'N/A'}
                  </p>
                </Col>
                <Col md='4'>
                  <span className='mb-0 text-dark fw-bolder'>{FM('mobile-number')}</span>
                  <p className='mb-0 fw-bold text-secondary'>
                    {user?.store_setting?.website ?? 'N/A'}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=''>
              {/* <h4 className='border-bottom  pb-1'>{FM('full-address-details')}</h4> */}
              <Row className='align-items-start gy-2'>
                <Col md='4'>
                  <span className='mb-0 text-dark fw-bolder'></span>
                  <p className='mb-0 fw-bold text-secondary'>
                    {user?.store_setting?.opening_time ?? 'N/A'}
                  </p>
                </Col>
                <Col md='4'>
                  <span className='h5 text-dark fw-bolder'></span>
                  <p className='mb-0 fw-bold text-secondary'>
                    {user?.store_setting?.closing_time ?? 'N/A'}
                  </p>
                </Col>
                <Col md='4'>
                  <span className='mb-0 text-dark fw-bolder'></span>
                  <p className='mb-0 fw-bold text-secondary'>{user?.city ?? 'N/A'}</p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=''>
              {/* <h4 className='border-bottom  pb-1'>{FM('full-address-details')}</h4> */}
              <Row className='align-items-start gy-2'>
                <Col md='12'>
                  <span className='mb-0 text-dark fw-bolder'>{FM('description')}</span>
                  <p className='mb-0 fw-bold text-secondary'>
                    {user?.store_setting?.description ?? 'N/A'}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row className=''>
            <Show IF={userType === UserType.Store}>
              <Col md='12'>
                <Card>
                  <CardHeader className='border-bottom'>
                    <CardTitle>
                      <>{FM('address')}</>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className='pt-2'>
                    <div className='' style={{ height: '350px', width: '100%' }}></div>
                  </CardBody>
                </Card>
              </Col>
            </Show>
          </Row>
        </>
      ) : (
        <>
          <Card>
            <CardBody className=''>
              <Row className='align-items-start gy-2'>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
              </Row>
            </CardBody>

            <CardBody>
              <Row className='align-items-start gy-2'>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
                <Col md='4'>
                  <Shimmer height={30} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </>
      )}
    </>
  )
}
export default ProfileCard
