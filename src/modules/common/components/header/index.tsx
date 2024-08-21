// import { Routes } from '../../../router'
import classNames from 'classnames'
import { ArrowLeft } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { isValid, log } from '@src/utility/Utils'
import Hide from '@src/utility/Hide'

interface HeaderProps {
  title: string | any
  children?: JSX.Element | JSX.Element[] | null
  titleCol?: string
  childCol?: string
  subHeading?: string | null
  icon?: any
  loading?: boolean
  description?: string | null
  noHeader?: boolean
  goBackTo?: string | boolean
  onClickBack?: () => void
  rowClass?: string
}
const Header = ({
  title,
  goBackTo,
  loading = false,
  onClickBack = () => {},
  children = null,
  titleCol = '7',
  childCol = '5',
  subHeading = null,
  icon = null,
  rowClass = 'mb-2',
  description = null,
  noHeader = false
}: HeaderProps) => {
  const navigation = useNavigate()
  // const  match  = matchRoutes()
  // const { t } = useTranslation()

  // const getRouteName = () => {
  //     let title = ""
  //     Routes?.forEach((route) => {
  //         if (route?.path === match.path) {
  //             title = route?.meta?.title
  //         }
  //     })
  //     return t(title)
  // }
  return (
    <>
      <Row className={`align-items-center ${rowClass}`}>
        <Hide IF={noHeader}>
          <Col md={titleCol} className='d-flex align-items-center'>
            <h2
              role={'button'}
              onClick={() => {
                goBackTo !== true
                  ? isValid(goBackTo)
                    ? navigation(String(goBackTo))
                    : onClickBack()
                  : onClickBack()
              }}
              className={classNames('content-header-title float-left mb-0 text-primary', {
                'border-end-0': !subHeading
              })}
            >
              {goBackTo ? <ArrowLeft size='25' /> : icon ? icon : null}{' '}
              <span className='align-middle text-capitalize'>{title}</span>
            </h2>
            <div className=' ms-1 p-0 mb-0'>{subHeading}</div>
          </Col>
        </Hide>
        <Col
          md={noHeader ? '12' : childCol}
          className={`py-1 py-md-0 d-flex ${
            noHeader ? '' : 'justify-content-md-end'
          } justify-content-start`}
        >
          {children}
        </Col>
        {description ? (
          <Col md='12' className='mt-1'>
            {description}
          </Col>
        ) : null}
      </Row>
    </>
  )
}

// Header.propTypes = {
//   title: PropTypes.string
// }

export default Header
