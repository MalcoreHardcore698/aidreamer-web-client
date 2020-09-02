import { useState, useCallback, useEffect } from 'react'

const storageName = 'g1w'

export const useAuth = () => {
  const [sessionID, setSessionID] = useState('')
  const [ready, setReady] = useState(false)

  const login = useCallback((sid) => {
    if (sid) {
      setSessionID(sid)

      localStorage.setItem(storageName, JSON.stringify(sid))
    }
  }, [])

  const logout = useCallback(() => {
    setSessionID('')
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data) {
      login(data)
      setReady(true)
    }
  }, [login])

  return { login, logout, sessionID, ready }
}