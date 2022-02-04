import { useState, useEffect, useContext } from 'react';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
	Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
	SimpleGrid,
	Link as ChakraLink
} from '@chakra-ui/react';


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
				if( !doc.data()?.private || (doc.data()?.private && doc.data()?.owner.uid === currentUser.uid) ){
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
				<SimpleGrid columns={2} spacing={10}>
					{
						rooms.map((room) => (
							<Stat key={room.key} borderWidth='1px' borderRadius='lg' maxW='sm' p='6'>
								<StatLabel>{room.members.length} members</StatLabel>
								<StatNumber>{room.room_name}</StatNumber>
								<StatHelpText>
									<ChakraLink as={Link} to={`/join/${room.key}`}>
										Join Room
									</ChakraLink>
									{room?.owner.uid === currentUser.uid &&
									(load ? (
										<p>Loading</p>
									) : (
										<div>
											<button onClick={() => deleteRoom(room.key)} color="red">Delete</button>
										</div>
									))}
								</StatHelpText>
							</Stat>
						))
					}
				</SimpleGrid>
			) }
		</div>
	)

}

export default Rooms;
