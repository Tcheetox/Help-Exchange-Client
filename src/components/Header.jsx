import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AppContext } from '../AppContext'

import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { UnreadMessagesBadge } from '../components/common/'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/ExitToApp'

export default function Header() {
	const history = useHistory()
	const { userLoggedIn, userEmail, logOut } = useContext(AppContext)
	const [expanded, setExpanded] = useState(false)
	const [dropdown, setDropdown] = useState(false)

	const FoldLink = ({ to, children }) => (
		<div onClick={() => setExpanded(false)}>
			<Link to={to}>{children}</Link>
		</div>
	)

	return (
		<Navbar
			expand='md'
			// fixed='top'
			className='header'
			bg='dark'
			expanded={expanded}>
			<Container>
				<Navbar.Brand onClick={() => setExpanded(false)}>
					<Link to='/'>LOGO</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' onClick={() => setExpanded(prev => !prev)}>
					<div className={`toggler ${expanded ? 'active' : ''}`}>
						<i></i>
						<i></i>
						<i></i>
					</div>
				</Navbar.Toggle>
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='mr-auto'>
						<FoldLink to='/map'>Map</FoldLink>
						<FoldLink to='/faq'>FAQ</FoldLink>
					</Nav>
					{userLoggedIn}
					<Nav className='account-navigation ml-auto'>
						{userLoggedIn ? (
							<>
								<FoldLink to='/users/account'>{userEmail}</FoldLink>
								<DropdownButton
									id='AccountDropdown'
									className='account-dropdown'
									title={<AccountIcon />}
									menuAlign='right'
									show={dropdown}
									onMouseLeave={() => setDropdown(false)}
									onMouseEnter={() => setDropdown(true)}>
									<Dropdown.Item onClick={() => history.push('/users/account')}>Profile</Dropdown.Item>
									<Dropdown.Item onClick={() => history.push('/users/dashboard')}>Dashboard</Dropdown.Item>
									<Dropdown.Item onClick={() => history.push('/users/messenger')}>
										Messenger <UnreadMessagesBadge />
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item onClick={() => logOut()}>
										Logout <ExitIcon />
									</Dropdown.Item>
								</DropdownButton>
							</>
						) : (
							<>
								<FoldLink to='/users/login'>Log in</FoldLink> |<FoldLink to='/users/signup'>Sign up</FoldLink>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
