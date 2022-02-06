import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

const RequireAuth = ({ children }) => {
	const { currentUser } = useContext(AuthContext);
	const location = useLocation();

	return currentUser ? children: <Navigate to="/login" replace state={{path: location.pathname }}/>
}

export default RequireAuth;
