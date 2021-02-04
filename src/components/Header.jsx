import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AppContext } from '../AppContext'

import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import UnreadMessagesBadge from '../components/decorations/UnreadMessagesBadge'
import DropdownButton from 'react-bootstrap/DropdownButton'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/ExitToApp'

// TODO: layout for user login/signup
// TODO: login form + login form on mousehover

export default function Header() {
	const history = useHistory()
	const { isUserLoggedIn, userEmail, logOut } = useContext(AppContext)
	const [expanded, setExpanded] = useState(false)
	const FoldLink = ({ to, children }) => (
		<div onClick={() => setExpanded(false)}>
			<Link to={to}>{children}</Link>
		</div>
	)
	const [dropdown, setDropdown] = useState(false)

	return (
		<Navbar
			expand='md'
			id='Header'
			// fixed='top'
			className='header-wrapper'
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
						<FoldLink to='/about'>About</FoldLink>
						<FoldLink to='/about'>FAQ</FoldLink>
						<FoldLink to='/about'>Contact</FoldLink>
					</Nav>
					{isUserLoggedIn}
					<Nav className='account-navigation ml-auto'>
						{isUserLoggedIn ? (
							<>
								<FoldLink to='/users/edit'>{userEmail}</FoldLink>
								<DropdownButton
									className={`account-dropdown ${dropdown}`}
									title={<AccountIcon />}
									menuAlign='right'
									show={dropdown}
									onMouseLeave={() => setDropdown(false)}
									onMouseEnter={() => setDropdown(true)}>
									<Dropdown.Item onClick={() => history.push('/users/edit')}>Profile</Dropdown.Item>
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
