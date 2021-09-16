import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { AppContext } from '../AppContext'

import Navbar from 'react-bootstrap/Navbar'
import Connect from './forms/user/Connect'
import Create from './forms/user/Create'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import { UnreadMessagesBadge } from '../components/common/'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/ExitToApp'
import { ReactComponent as Logo } from '../media/logo.svg'

export default function Header() {
	const history = useHistory()
	const location = useLocation()
	const { userLoggedIn, userEmail, logOut } = useContext(AppContext)
	const [expanded, setExpanded] = useState(false)
	const [dropdown, setDropdown] = useState(false)
	const [loginShow, setLoginShow] = useState(false)
	const [signupShow, setSignupShow] = useState(false)

	const FoldLink = ({ to, children, className }) => (
		<div
			onClick={() => {
				setExpanded(false)
				setDropdown(false)
			}}>
			<Link to={to} className={className}>
				{children}
			</Link>
		</div>
	)

	const handleClick = (to = '', callback = null) => {
		setExpanded(false)
		setDropdown(false)
		if (history !== '') history.push(to)
		if (callback) callback()
	}

	// Handle smooth scroll to different page with a given element #ID
	useEffect(() => {
		if (location.hash) {
			let elem = document.getElementById(location.hash.slice(1))
			if (elem) elem.scrollIntoView({ behavior: 'smooth' })
		} else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}, [location])

	return (
		<Navbar id='Header' expand='lg' className={`header ${userLoggedIn ? 'connected' : 'disconnected'}`} expanded={expanded}>
			<Container>
				<Modal className='login-modal' show={loginShow} onHide={() => setLoginShow(false)} centered>
					<Modal.Header closeButton>
						<Modal.Title>Log in</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Connect modalShow={b => setLoginShow(b)} />
					</Modal.Body>
				</Modal>
				<Modal className='signup-modal' show={signupShow} onHide={() => setSignupShow(false)} centered>
					<Modal.Header closeButton>
						<Modal.Title>Sign up</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Create modalShow={b => setSignupShow(b)} />
					</Modal.Body>
				</Modal>
				<Navbar.Brand onClick={handleClick}>
					<Link to='/'>
						<Logo className='logo' />
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' onClick={() => setExpanded(prev => !prev)}>
					<div className={`toggler ${expanded ? 'active' : ''}`}>
						<i></i>
						<i></i>
						<i></i>
					</div>
				</Navbar.Toggle>
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='mr-auto nav-links'>
						<FoldLink to='/#About'>About us</FoldLink>
						<FoldLink to='/map' className={location.pathname.toLowerCase().includes('/map') ? 'active' : ''}>
							Map
						</FoldLink>
						<FoldLink to='/faq' className={location.pathname.toLowerCase().includes('/faq') ? 'active' : ''}>
							FAQ
						</FoldLink>
					</Nav>
					{userLoggedIn}
					<Nav className='account-navigation ml-auto'>
						{userLoggedIn ? (
							<div
								className='account-group'
								onClick={() => setDropdown(!dropdown)}
								onMouseLeave={() => setDropdown(false)}
								onMouseEnter={() => setDropdown(true)}>
								<FoldLink to='/users/account'>{userEmail}</FoldLink>
								<DropdownButton id='AccountDropdown' className='account-dropdown' title={<AccountIcon />} menuAlign='right' show={dropdown}>
									<Dropdown.Item onClick={() => handleClick('/users/account')}>Profile</Dropdown.Item>
									<Dropdown.Item onClick={() => handleClick('/users/dashboard')}>Dashboard</Dropdown.Item>
									<Dropdown.Item onClick={() => handleClick('/users/messenger')}>
										Messenger <UnreadMessagesBadge />
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item onClick={() => handleClick('', logOut)}>
										Logout <ExitIcon />
									</Dropdown.Item>
								</DropdownButton>
							</div>
						) : (
							<div className='account-links'>
								<Button className='fancy-blue' onClick={() => handleClick('', () => setLoginShow(true))}>
									Log in
								</Button>
								<Button className='plain-blue' onClick={() => handleClick('', () => setSignupShow(true))}>
									Sign up
								</Button>
							</div>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
