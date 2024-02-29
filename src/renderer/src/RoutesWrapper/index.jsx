import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '../context/userContext'
import axios from 'axios'
import Home from '../components/Home'
import Upsert from '../components/Upsert'
import Login from '../components/Login'
import NotFound from '../components/NotFound'

const RoutesWrapper = () => {
  const { user, token } = useUser()
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'))
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'))
    if (isLoggedIn && token) {
      axios.defaults.headers.common['Authorization'] = ``
      axios
        .post('http://localhost:5000/api/format', { token })
        .then((resp) => console.log(resp?.data))
        .catch((err) => {
          console.log(err)
          logout()
        })
    }
  }, [user])
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path='/' exact element={<Home />} />
          <Route path='/upsert-schedule/:day' element={<Upsert />} />
          <Route path='/login' element={<Navigate to='/' />} />
          <Route path='*' element={<NotFound />} />
        </>
      ) : (
        <>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Navigate from='*' to='/login' />} />
        </>
      )}
    </Routes>
  )
}

export default RoutesWrapper
