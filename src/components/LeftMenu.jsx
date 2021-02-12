import React, { useContext, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../AppContext'
import { UnreadMessagesBadge } from './common/'
import MapIcon from '@material-ui/icons/Public'
import CreateIcon from '@material-ui/icons/Create'
import MailIcon from '@material-ui/icons/MailOutline'

export default function LeftMenu() {
	const menuRef = useRef()
	const footerRef = useRef()
	const headerRef = useRef()
	const [top, setTop] = useState('40%')
	const [offset, setOffset] = useState(0)
	const { userLoggedIn } = useContext(AppContext)

	useEffect(() => {
		footerRef.current = document.querySelector('.footer')
		headerRef.current = document.querySelector('.header')
	}, [])

	const handleDrag = e => {
		const newPosition = e.pageY - offset
		if (
			headerRef.current.offsetHeight < newPosition &&
			footerRef.current.offsetTop > newPosition + menuRef.current.offsetHeight
		)
			setTop(`${newPosition}px`)
	}

	return userLoggedIn ? (
		<div
			className='slider'
			ref={menuRef}
			style={{ top: `${top}` }}
			onDragStart={e => setOffset(menuRef.current ? e.pageY - menuRef.current.offsetTop : 50)}
			onDragOver={handleDrag}
			draggable>
			<div className='left-menu'>
				<Link to='/map'>
					<MapIcon />
				</Link>
				<Link to='/users/dashboard/create'>
					<CreateIcon />
				</Link>
				<Link to='/users/messenger'>
					<UnreadMessagesBadge />
					<MailIcon />
				</Link>
			</div>
		</div>
	) : null
}
