import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase.js';
import { useNavigate, Link } from 'react-router-dom';
import Layout from './layout/Layout';
import {
	Table, 
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	Link as ChakraLink
} from '@chakra-ui/react';


const AllMeetingData = () => {
	const navigate = useNavigate();
	const [meetings, setMeetings] = useState([]);
	
	useEffect(async () => {
		const querySnapshot = await getDocs(collection(db, "roomAnalysis"))
		querySnapshot.forEach((doc) => {
			setMeetings((p)=> [...p, {...doc.data(), id: doc.id}]);
		});
		console.log(meetings);
		
	}, []);

	return (
		<Layout>
			<Table variant='simple'>
				<TableCaption>All audio call data</TableCaption>
				<Thead>
					<Tr>
						<Th>Call Name</Th>
						<Th>Call date</Th>
					</Tr>
				</Thead>
				<Tbody>
					{meetings.map((meeting, i) => (
						<Tr key={i}>
							<Td>
								<ChakraLink as={Link} to={`/details/${meeting.id}`}>
									{meeting.room_name}
								</ChakraLink>
							</Td>
							<Td>{meeting.created_at.seconds}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Layout>

	)

}

export default AllMeetingData;
