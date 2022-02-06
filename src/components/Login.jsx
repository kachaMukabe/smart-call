import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../AuthContext'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react';

const Login = () => {
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		if (currentUser){
			navigate("/");
		}
	});

	return (
		<Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Make your audio<br />
            <Text as={'span'} color={'#603F83FF'}>
              smarter!
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Make audio calls and get realtime transcriptions and insights on your
            conversations. 
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'#603F83FF'}
              bg={'#603F83FF'}
              rounded={'full'}
              px={6}
							onClick={() => {
								signInWithPopup(auth, provider).then(() => {
									navigate("/");
								}).catch(e => console.log(e));
							}}
              _hover={{
                bg: '#603F83FF',
              }}>
              Login with google
            </Button>
          </Stack>
        </Stack>
      </Container>
	)
};

export default Login;
