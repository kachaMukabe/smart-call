import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import {
  Box,
  Heading,
  Container,
  Center,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  SimpleGrid,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import {
  FiPhoneCall,
  FiUsers,
  FiZap
} from 'react-icons/fi';
import cover from "../images/cover.png";

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="#603F83FF"
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  });

  return (
    <Container maxW={"3xl"}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Make your audio
          <br />
          <Text as={"span"} color={"#603F83FF"}>
            smarter!
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Make audio calls and get realtime transcriptions and insights on your
          conversations.
        </Text>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Button
            colorScheme={"#603F83FF"}
            bg={"#603F83FF"}
            rounded={"full"}
            px={6}
            onClick={() => {
              signInWithPopup(auth, provider)
                .then(() => {
                  navigate("/");
                })
                .catch((e) => console.log(e));
            }}
            _hover={{
              bg: "#603F83FF",
            }}
          >
            Login with google
          </Button>
        </Stack>
        <Flex w={"full"} >
          <Center w='full'>
            <Image src={cover} alt="Cover image" height={{ sm: '24rem', lg: '28rem' }} />
          </Center>
        </Flex>
      </Stack>
        <SimpleGrid w='full' columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={<Icon as={FiPhoneCall} w={10} h={10} />}
            title={"One on One smart call"}
            text={
              "One on one audio calls with conversational analysis"
            }
          />
          <Feature
            icon={<Icon as={FiUsers} w={10} h={10} />}
            title={"Group audio rooms"}
            text={
              "Group audio calls with conversational analysis"
            }
          />
          <Feature
            icon={<Icon as={FiZap} w={10} h={10} />}
            title={"AI powered calls"}
            text={
              "Every call has A.I transcriptions, insights and more"
            }
          />
        </SimpleGrid>
      <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© {new Date().getFullYear()} Kacha Mukabe. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
        </Stack>
      </Container>
    </Box>
    </Container>
  );
};

export default Login;
