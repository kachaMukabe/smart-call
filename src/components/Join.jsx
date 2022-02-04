import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase"
import { AuthContext } from "../AuthContext";
import Layout from './layout/Layout';
import UserCallCard from './UserCallCard';
import AgoraRTC from "agora-rtc-sdk";
import {
	Select,
	SimpleGrid,
	Box,
	Heading,
	Avatar,
	Center,
	Button,
	Modal,
	ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
	useDisclosure,
	useColorModeValue,
	Container,
	Stack,
	Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react';
import {
	FiMic,
	FiLogOut,
	FiMicOff,
	FiRadio,
	FiSpeaker,
	FiMusic
} from 'react-icons/fi';


let client = AgoraRTC.createClient({
	mode: "rtc",
	codec: "vp8",
});

client.init(process.env.REACT_APP_AGORA_KEY);

let handleError = function (err){
	console.log("Error: ", err);
};

const Join = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [load, setLoad] = useState(false);
	const [active, setActive] = useState([]);
	const [room, setRoom] = useState("");
	const [conn_state, setConn_state] = useState("");
	const [stream_id, setStreamId] = useState(0);
	const [mute, setMute] = useState(false);
	const [stream, setStream] = useState();
	const [state, setState] = useState(false);
	const [volume, setVolume] = useState(50);
	const [profiles, setProfiles] = useState([
		"speech_low_quality",
		"speech_standard",
		"music_standard",
		"high_quality",
		"high_quality_stereo",
	]);
	const [audio_input, setAudio_input] = useState([]);
	const [audio_output, setAudio_output] = useState([]);
	const [hostId, setHostId] = useState("");

	const { currentUser } = useContext(AuthContext);
	const { isOpen, onClose, onOpen } = useDisclosure();

	async function addVideoStream(elementId){
		let remoteContainer = document.getElementById("remote");
		let streamDiv = document.createElement("div");
		streamDiv.id = elementId;
		streamDiv.style.transform = "rotateY(180deg)";
		remoteContainer.appendChild(streamDiv);
	}

	async function removeVideoStream(elementId){
		let remoteDiv = document.getElementById(elementId);
		if(remoteDiv){
			remoteDiv.parentNode.removeChild(remoteDiv);
		}
	}

	const join = async () => {
		setLoad(true);
		const { token, uid } = await(
			await fetch(`https://agora-token.azurewebsites.net/api/trigger?name=${room}`)
		).json();
		client.join(token, room, uid, async (userId) => {
			setStreamId(userId);
			localStorage.setItem("ID", id);
			localStorage.setItem("streamId", userId);
			let new_active = active.filter((user) => user.uid != currentUser.uid);
			new_active.push({
				uid: currentUser.uid,
				pic: currentUser.photoURL,
				name: currentUser.displayName,
				userId: userId,
			});
			await updateDoc(doc(db, "rooms", id), {
				members: new_active,
			}).then(() => {
				let localStream = AgoraRTC.createStream({
					audio: true,
					video: false,
				});
				setStream(localStream);
				localStream.init(() => {
					localStream.play("me");
					client.publish(localStream, handleError);
				}, handleError);
				setLoad(false);
				setConn_state(client.getConnectionState());
				setStreamId(userId);
			}). catch((e) => setLoad(false));
		});
	};

	useEffect(() => {
		console.log("hi there")
		window.onbeforeunload = (event) => {
			const e = event || window.event;
			console.log("Hello");
			e.preventDefault();
			if(e){
				e.returnValue = "";
			}
			return "";
		};

		setStream(null);

		onSnapshot(doc(db, "rooms", id), (room) => {
			setActive(room.data()?.members);
			setRoom(room.data()?.room_name);
			setHostId(room.data()?.owner.uid);
		});

		AgoraRTC.getDevices((devices) => {
			setAudio_input([]);
			setAudio_output([]);
			devices.forEach(device => {
				if(device.kind === 'audioinput'){
					setAudio_input((p) => [...p, device]);
				} else if (device.kind === 'audiooutput'){
					setAudio_output((p) => [...p, device]);
				}
			});
		});

		client.on("stream-added", function(evt){
			client.subscribe(evt.stream, handleError);
		});
		client.on("stream-subscribed", function(evt){
			let stream = evt.stream;
			let streamId = String(stream?.getId());
			addVideoStream(streamId);
			stream.play(streamId);
		});

		client.on("connection-state-change", (evt) =>{
			setConn_state(evt.curState);
		});

		client.on("stream-removed", async function (evt){
			let stream = evt.stream;
			let streamId = String(stream?.getId);
			stream.close();
			const data = await getDoc(doc(db, "rooms", localStorage.getItem("ID")));
			
			updateDoc(doc(db, "rooms", localStorage.getItem("ID")), {
				members: data.data()?.members.filter(
					(member) => member.userId !== parseInt(localStorage.getItem("streamId"))
				),
			}).then(() => localStorage.removeItem("streamId"))
				.catch((e) => console.log(e));
			removeVideoStream(streamId);;
		});

		client.on("peer-leave", async function (evt) {
			let stream = evt.stream;
			let streamId = String(stream.getId());
			stream.close();
			const data = await getDoc(doc(db, "rooms", localStorage.getItem("ID")));

			updateDoc(doc(db, "rooms", localStorage.getItem("ID")), {
				members: data.data()?.members.filter(
					member => member.userId !== parseInt(localStorage.getItem("streamId"))
				),
			}).then(() => localStorage.removeItem("streamId"))
				.catch((e) => console.log(e));
			removeVideoStream(streamId);
		});

		return () => client.leave(async () => {
			if(localStorage.getItem("streamId")){
				const data = await getDoc(
					doc(db, "rooms", localStorage.getItem("ID"))
				);

				updateDoc(doc(db, "rooms", localStorage.getItem("ID")), {
					members: data.data()?.members.filter(
						member => member.userId != parseInt(localStorage.getItem("streamId"))
					),
				}).then(() => localStorage.removeItem("streamId"))
					.catch((e) => console.log(e));
			}
		});
	}, []);

	if (load){
		return <Layout><p>Loading</p></Layout>
	} 

	return (
		<Layout>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Audio profile</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Select 
							placeholder="Select profile"
							onChange={(e) => stream.setAudioProfile(e)}
						>
							{profiles.map((profile, i) => (
								<option key={i} value={profile}>
									{profile.split("_").join(" ")}
								</option>
							))}
						</Select>
					</ModalBody>
				</ModalContent>
			</Modal>
			{ conn_state == "CONNECTED" ? (
				<div>
					<Heading>Participants</Heading>
					<div id="me"></div>
					<div id="remote"></div>
					<SimpleGrid minChildWidth='250px' spacing='40px'>
						{active.map((person, i) => (
							<UserCallCard key={i} key={person.uid} currentUser={currentUser} />
						))}
					</SimpleGrid>
					<p>{conn_state}</p>
				</div>
			): (
				<Button onClick={join} size="lg" colorScheme="blue">Join room</Button>
			) }
			{stream && (
				<div>
					<Box
					>
						<Container
							as={Stack}
							maxW={'6xl'}
							py={4}
							direction={{  base: 'column', md: 'row' }}
							spacing={4}
							justify={{base: 'center', md: 'space-between'}}
							align={{ basde: 'center', md: 'center' }}
						>
						<div>
							{mute ? (
								<Button onClick={() => {
									stream.unmuteAudio();
									setMute(false);
									}}
								>
									<FiMicOff />
								</Button>
							): (
								<Button onClick={() => {
									stream.muteAudio();
									setMute(true);
									}}
								>
									<FiMic />
								</Button>
							)}
						</div>
						<Popover
							placement='top'
							closeOnBlur={false}
						>
							<PopoverTrigger>
								<Button><FiSpeaker /></Button>
							</PopoverTrigger>
							<PopoverContent >
								<PopoverHeader>
									Select output device
								</PopoverHeader>
								<PopoverArrow />
								<PopoverCloseButton />
								<PopoverBody>
									{audio_output.map((d,i) => (
									<Button key={i} 
										onClick={() => {
											stream.setAudioProfile(d.deviceId, () => {
												console.log("success");
											})
										}}
									>
										{d.label}
									</Button>
									))}
								</PopoverBody>
							</PopoverContent>
						</Popover>

						<Popover
							placement='top'
							closeOnBlur={false}
						>
							<PopoverTrigger>
								<Button><FiMusic /></Button>
							</PopoverTrigger>
							<PopoverContent >
								<PopoverHeader>
									Select input device
								</PopoverHeader>
								<PopoverArrow />
								<PopoverCloseButton />
								<PopoverBody>
									{audio_input.map((d,i) => (
									<Button key={i} 
										onClick={() => {
											stream.switchDevice("audio", d.deviceId, () => {
												console.log("success");
											})
										}}
									>
										{d.label}
									</Button>
									))}
								</PopoverBody>
							</PopoverContent>
						</Popover>
							<Button onClick={onOpen}>
								<FiRadio />
							</Button>
						<Button onClick={() => {
							client.leave(() => {
								updateDoc(doc(db, "rooms", id), {
									members: active.filter( member => member.userId !== parseInt(stream_id) ),
								}).then(() => navigate("/"))
									.catch((e) => console.log(e));
							});
							}}
						><FiLogOut /></Button>
					</Container>
					</Box>
				</div>
			)}
		</Layout>
	)

}

export default Join;
