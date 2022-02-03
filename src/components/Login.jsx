import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../AuthContext'

const Login = () => {
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		if (currentUser){
			navigate("/");
		}
	});

	return (
		<div>
			<button
				onClick={() => {
					signInWithPopup(auth, provider).then(() => {
						navigate("/");
					}).catch(e => console.log(e));
				}}
			>
				Login with google
			</button>
		</div>
	)
};

export default Login;
