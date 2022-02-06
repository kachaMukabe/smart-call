import React from 'react';
import SidebarWithHeader from './Sidebar';

const Layout = ({children}) => {

	return (
		<SidebarWithHeader>
			<main>{children}</main>
		</SidebarWithHeader>
	)
}

export default Layout;
