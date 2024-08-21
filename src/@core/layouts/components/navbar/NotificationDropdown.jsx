// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import { Bell, MessageSquare } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Avatar Imports
import useUser from '@hooks/useUser'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import httpConfig from '@src/utility/http/httpConfig'
import { isValidArray, log } from '@src/utility/Utils'
import axios from 'axios'
import Show from '@src/utility/Show'
import { NotificationLocator } from '@hooks/NotificationLocator'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRedux } from '@src/redux/useRedux'
import { setUnreadNotification } from '@src/redux/notifications'
import { Permissions } from '@src/utility/Permissions'

const NotificationDropdown = () => {
  const [loading, setLoading] = useState(false)
  const [loadingRead, setLoadingRead] = useState(false)
  const {
    dispatch,
    state: {
      notificationCls: { latestNotification, unreadNotification }
    }
  } = useRedux()
  const notifications = latestNotification
  const location = useLocation()
  const user = useUser()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const [notificationList, setNotificationList] = useState([])

  const [error, setError] = useState(null)

  const loadNotification = () => {
    axios
      .post(`${httpConfig.baseUrl}${ApiEndpoints.notification_list}`, {})
      .then((res) => {
        // log(res, 'res')
        setLoading(false)
        setNotificationList(res?.data?.data)
        dispatch(
          setUnreadNotification(res?.data?.data?.filter((a) => a?.read_status === 0)?.length)
        )
      })
      .catch((err) => {
        log(err?.data?.data?.message)
        setError(err?.data?.data?.message)
        
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotification()
    }, 4000)
    return () => clearTimeout(timer)
    
  }, [])

  const read = (id) => {
    axios
      .get(`${httpConfig.baseUrl}${ApiEndpoints.notification_read}${id}/read`, {})
      .then((res) => {
        // log(res, 'res')
        setLoadingRead(false)
        loadNotification()
      })
      .catch((err) => {
        setError(err?.response?.data?.message)
      })
  }
  const readAll = () => {
    axios
      .get(`${httpConfig.baseUrl}${ApiEndpoints.notification_read_all}`, {})
      .then((res) => {
        // log(res, 'res')
        setLoadingRead(false)
        loadNotification()
      })
      .catch((err) => {
        setError(err?.response?.data?.message)
      })
  }

  useEffect(() => {
    if (notifications?.data?.length > 0) {
      setOpen(false)
    }
  }, [notifications])

  const handleRead = (e, item) => {
    e.preventDefault()
    if (item?.read_status === 0) {
      read(item?.id)
    }
    NotificationLocator(item, navigate)
    setOpen(false)
  }

  // ** Notification Array
  const notificationsArray = [
    ...notificationList?.map((m, i) => ({
      ...m,
      avatarIcon: <MessageSquare size={14} />,
      color: 'light-primary',
      subtitle: m?.message,
      title_el: (
        <p className='mb-0'>
          <span className='fw-bolder'>{m?.title}</span>
        </p>
      )
    }))
  ]

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notificationsArray.map((item, index) => {
          return (
            <a
              key={index}
              className='d-flex'
              href={item.switch ? '#' : '/'}
              onClick={(e) => {
                e.preventDefault()
                // read(item?.id)
                handleRead(e, item)
              }}
            >
              <div
                className={classnames('list-item d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                {!item.switch ? (
                  <Fragment>
                    <div className='me-1'>
                      <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                          ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                          : item.avatarIcon
                          ? {
                              icon: item.avatarIcon,
                              color: item.color
                            }
                          : null)}
                      />
                    </div>
                    <div className='list-item-body flex-grow-1'>
                      <span className={item?.read_status === 1 ? 'text-secondary' : 'text-primary'}>
                        {item.title_el}
                      </span>
                      <small className={item?.read_status === 1 ? 'text-muted' : 'text-secondary'}>
                        {item.subtitle}
                      </small>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.title_el}
                    {item.switch}
                  </Fragment>
                )}
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <Show IF={isValidArray(notificationList)}>
      <UncontrolledDropdown
        tag='li'
        className='dropdown-notification nav-item me-25'
        isOpen={open}
        toggle={() => setOpen(!open)}
      >
        <DropdownToggle tag='a' className='nav-link' href='/' onClick={(e) => e.preventDefault()}>
          <Bell size={21} />
          <Badge pill color='danger' className='badge-up'>
            {notificationList?.filter((m) => m?.read_status !== 1)?.length}
          </Badge>
        </DropdownToggle>
        <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
          <li className='dropdown-menu-header'>
            <DropdownItem className='d-flex' tag='div' header>
              <h4 className='notification-title mb-0 me-auto'>Notifications</h4>
            </DropdownItem>
          </li>
          {renderNotificationItems()}
          <li className='dropdown-menu-footer'>
            
            <Button color='primary' block onClick={readAll}>
              Read all notifications
            </Button>
           
          </li>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Show>
  )
}

export default NotificationDropdown
