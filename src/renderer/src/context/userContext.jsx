import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import parseJwt from '../../utils/parseJWT'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      let localToken = localStorage.getItem('token')
      if (localToken) {
        let jwtToken = parseJwt(localToken)
        let userID = jwtToken.id
        if (userID) {
          // You may want to validate the token on the server-side in a real-world scenario.
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          axios
            .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_USERS_PATH}/${userID}`)
            .then(response => {
              if (response.data && response.data.firstName) {
                if (!user) setUser(response.data)
              } else {
                logout()
              }
            })
            .catch(error => {
              console.error(error)
              logout()
            })
        }
      }
    }
  }, [token])

  const login = token => {
    localStorage.setItem('token', token)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return <UserContext.Provider value={{ user, login, logout, token }}>{children}</UserContext.Provider>
}
