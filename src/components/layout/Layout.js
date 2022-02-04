import React from 'react';
import { Box, Flex, Container, Heading } from '@chakra-ui/react';
import SidebarWithHeader from './Sidebar';

const Layout = ({children}) => {

	return (
		<SidebarWithHeader>
			<main>{children}</main>
		</SidebarWithHeader>
	)
}

export default Layout;
