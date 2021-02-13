import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AppContext } from '../AppContext'

import Navbar from 'react-bootstrap/Navbar'
import Connect from './forms/user/Connect'
import Create from './forms/user/Create'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
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
	const [loginShow, setLoginShow] = useState(false)
	const [signupShow, setSignupShow] = useState(false)

	const FoldLink = ({ to, children, callback = null }) => (
		<div
			onClick={() => {
				setExpanded(false)
				if (callback) callback()
			}}>
			<Link to={to}>{children}</Link>
		</div>
	)

	return (
		<Navbar expand='md' className='header' bg='dark' expanded={expanded}>
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
							<div
								className='account-group'
								onMouseLeave={() => setDropdown(false)}
								onMouseEnter={() => setDropdown(true)}>
								<FoldLink to='/users/account'>{userEmail}</FoldLink>
								<DropdownButton
									id='AccountDropdown'
									className='account-dropdown'
									title={<AccountIcon />}
									menuAlign='right'
									show={dropdown}>
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
							</div>
						) : (
							<div className='account-links'>
								<FoldLink
									to='#'
									callback={() => {
										setDropdown(false)
										setLoginShow(true)
									}}>
									Log in
								</FoldLink>
								|
								<FoldLink
									to='#'
									callback={() => {
										setDropdown(false)
										setSignupShow(true)
									}}>
									Sign up
								</FoldLink>
							</div>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
