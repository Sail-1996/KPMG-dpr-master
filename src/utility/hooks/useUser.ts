import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { isValid } from '../Utils'

interface UserProps {
  vendor_id?: number
  id: number
  token?: any
  roles?: any
  access_token?: any
}
const useUser = () => {
  const user = useAppSelector((s) => s.auth?.userData)
  const [t, setT] = useState<UserProps | null>(null)

  useEffect(() => {
    if (isValid(user)) {
      setT(user)
    }
  }, [user])

  return t
}

export default useUser
