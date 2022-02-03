import { useState, useEffect, useContext } from 'react';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';


const Rooms = () => {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const { currentUser } = useContext(AuthContext);
	const [load, setLoad] = useState(false);

	const deleteRoom = async (id) => {
		setLoad(true);
		deleteDoc(doc(db, "rooms", id)).then(() => setLoad(false)).catch((e) => console.log(e));
	};

	useEffect(() => {
		const unsub = onSnapshot(collection(db, "rooms"), (room) => {
			setRooms([]);
			room.docs.forEach((doc) => {
				console.log(doc.data())
				if( !doc.data()?.private || (doc.data()?.private && doc.data()?.owner.uid == currentUser.uid) ){
					setRooms((prev) => [...prev, { ...doc.data(), key: doc.id }]);
				}
			});
			setLoading(false);
		});
		console.log(rooms);
		
		return () => unsub();
	}, []);

	return (
		<div>
			{ loading ? (<p>Loading</p>): (
				rooms.map((room) => (
					<div key={room.key}>
						<h3>{room.room_name}</h3>
						<p>hh</p>
					</div>
				))
			) }
						<h4>In rooms</h4>
		</div>
	)

}

export default Rooms;
