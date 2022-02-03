import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { addDoc, collection } from "firebase/firestore"
import { AuthContext } from "../AuthContext"
import Rooms from './Rooms'


const Home = () => {
	const [name, setName] = useState("");
	const { currentUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [privateRoom, setPrivateRoom] = useState(false);
	const navigate = useNavigate();

	const createRoom = async () => {
		if (name.trim().length > 0){
			setLoading(true);

			const room = await addDoc(collection(db, "rooms"), {
				room_name: name,
				created_at: new Date(),
				private: privateRoom,
				owner: {
					uid: currentUser.uid,
					pic: currentUser.photoURL,
					name: currentUser.displayName,
				},
				members: [],
			});

			setLoading(false);
			navigate(`/join/${room.id}`);
		}
	}

	return (
		<>
			<div>Hello</div>
			<input type="text" placeholder="room name" onChange={(e) => setName(e.target.value)} />
			<button onClick={()=>{
				setPrivateRoom(true);
				createRoom();
			}}>Private</button>
			<button onClick={()=>{
				setPrivateRoom(false);
				createRoom();
			}}>Public</button>
			<Rooms />
		</>
	)
}

export default Home;
