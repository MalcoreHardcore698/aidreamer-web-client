import { useState, useCallback, useEffect } from 'react'

const storageName = 'g1w'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState('')

  const login = useCallback((sessionID) => {
    if (sessionID) {
      setToken(sessionID)
      setUserId(sessionID)

      localStorage.setItem(storageName, JSON.stringify(sessionID))
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId('')
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data) {
      login(data)
      setReady(true)
    }
  }, [login])

  return { login, logout, token, userId, ready }
}