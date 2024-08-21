import { Fragment } from 'react'
import { Card, CardBody, CardHeader, CardImg, Col, Row } from 'reactstrap'
import { UserType } from '@src/utility/Const'
import { FM, formatDate } from '@src/utility/Utils'
import useUserType from '@src/utility/hooks/useUserType'
import httpConfig from '@src/utility/http/httpConfig'
import Show from '@src/utility/Show'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'

const ProfileCard = ({ user = {}, loading = false }: { user: any; loading: boolean }) => {
  const userType = useUserType()
  return (
    <Fragment>
      {loading ? (
        <>
          <Card className='mb-0 h-100'>
            <CardHeader>
              <Shimmer width={'280px'} height={'100px'} />
            </CardHeader>

            <CardBody>
              <div className='info-container'>
                <>
                  <ul className='list-unstyled'>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                  </ul>
                </>
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <Card className='mb-0 h-100'>
            <CardBody>
              <div className='info-container'>
                <>
                  <Row className='list-unstyled'>
                    {/* <Col md='2'>
                      <CardImg top className='' src={user?.avatar} alt='card-top' />
                    </Col> */}
                    <Col>
                      <Row>
                        <Col md='3' className='mb-75'>
                          <span className='fw-bolder text-dark me-25'>
                            <>{FM('name')}:</>
                          </span>
                          <span className='d-block'>
                            <>{user?.name ?? 'N/A'}</>
                          </span>
                        </Col>
                        <Col md='3' className='mb-75'>
                          <span className='fw-bolder text-dark me-25'>
                            <>{FM('email')}:</>
                          </span>
                          <span className='d-block'>
                            <>{user?.email ?? 'N/A'}</>
                          </span>
                        </Col>
                        <Col md='3' className='mb-75'>
                          <span className='fw-bolder text-dark me-25'>
                            <>{FM('mobile-number')}:</>
                          </span>
                          <span className='d-block'>
                            <>{user?.mobile_number ?? 'N/A'}</>
                          </span>
                        </Col>
                        <Col md='3' className='mb-75'>
                          <span className='fw-bolder text-dark me-25'>
                            <>{FM('updated-at')}:</>
                          </span>
                          <span className='d-block'>
                            <>{formatDate(user?.updated_at, 'DD MMM YYYY') ?? 'N/A'}</>
                          </span>
                        </Col>
                        <Col md='12' className='mb-75'>
                          <span className='fw-bolder text-dark me-25'>
                            <>{FM('address')}:</>
                          </span>
                          <span className='d-block'>
                            <>{user?.address ?? 'N/A'}</>
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </Fragment>
  )
}

export default ProfileCard
