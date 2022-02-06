import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { AuthContext } from "../AuthContext"
import { 
	Box,
	Button,
	FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
	Input,
	HStack,
	RadioGroup,
	Radio
} from "@chakra-ui/react"
import Rooms from './Rooms'
import Layout from './layout/Layout'


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

			const roomAnalysis = await setDoc(doc(db, "roomAnalysis", room.id),{
				created_at: new Date(),
				transcript: [],
				insights: [],
				topics: []
			});

			setLoading(false);
			navigate(`/join/${room.id}`);
		}
	}

	return (
		<Layout>
			<Box p={6}>
				<FormControl>
					<FormLabel>Room Name</FormLabel>
					<Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
					<RadioGroup defaultValue="public">
						<HStack spacing='24px'>
							<Radio value="private">Private</Radio>
							<Radio value="public">Public</Radio>
						</HStack>
					</RadioGroup>
				</FormControl>
				<Button 
					bg="#603F83FF" 
					color="white" 
					onClick={createRoom}
					isLoading={loading}
				> 
					Create 
				</Button>
			</Box>
			<Rooms />
		</Layout>
	)
}

export default Home;
