import {
	Box,
  Avatar,
	Center,
	useColorModeValue,
	Heading,
	Text,
	Stack,
} from '@chakra-ui/react';

export default function UserCallCard({ currentUser }) {
	return(
	<Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'250px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          textAlign={'center'}
          >
          <Avatar
            size={'xl'}
            src={currentUser.photoURL}
            alt={'Avatar Alt'}
            mb={4}
            pos={'relative'}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Member
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
						{currentUser.displayName}
          </Heading>
        </Stack>
      </Box>
    </Center>
	)
}
