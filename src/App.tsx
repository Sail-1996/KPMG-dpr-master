import useUser from '@hooks/useUser'
import axios from 'axios'
import React, { Suspense, useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { useDispatch } from 'react-redux'
import { handleLogout } from './redux/authentication'

// ** Router Import
import Router from './router/Router'
import ApiEndpoints from './utility/http/ApiEndpoints'
import httpConfig from './utility/http/httpConfig'
import { log } from './utility/Utils'

const App = () => {
  const dispatch = useDispatch()
  const user = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  // timeout in minutes
  let timer = user?.roles?.name === 'Admin' ? 15 : 30
  const { isLeader } = useIdleTimer({
    crossTab: true,
    leaderElection: true,
    timeout: Number(timer) * 60000,
    onIdle: () => {
      axios
        .post(`${httpConfig.baseUrl}${ApiEndpoints.logout}`)
        .then((res) => {
          setLoading(false)
          dispatch(handleLogout())
          const baseUrl = import.meta.env.BASE_URL

          window.location.href = baseUrl + '/login'
        })
        .catch((err) => {
          setError(err?.response?.data?.message)
        })
    }
  })
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
