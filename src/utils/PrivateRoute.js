import React, { useContext } from 'react'
import { Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

//const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
	//const { currentUser } = useContext(AuthContext);
	//const navigate = useNavigate();

	//if(currentUser){
		//navigate("/login");
	//}

	//return (
	//<Route
		//{...rest}
		//render={(routeProps) =>  
			//<RouteComponent {...routeProps} /> 
		//}
	///>
		
	//);
//};

const RequireAuth = ({ children }) => {
	const { currentUser } = useContext(AuthContext);
	const location = useLocation();

	return currentUser ? children: <Navigate to="/login" replace state={{path: location.pathname }}/>
}

export default RequireAuth;
