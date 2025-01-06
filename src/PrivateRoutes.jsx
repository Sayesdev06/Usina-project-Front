import React from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({ children, jwt }) => {
  
    return jwt !== undefined ? children : <Navigate to='/login' />
}

export default PrivateRoutes