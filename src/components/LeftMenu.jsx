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
	const { isUserLoggedIn } = useContext(AppContext)

	useEffect(() => {
		footerRef.current = document.querySelector('.footer')
		headerRef.current = document.querySelector('.header')
	}, [])

	const handleDrag = e => {
		const newPosition = e.pageY - offset
		if (footerRef.current && headerRef.current && menuRef.current) {
			if (
				headerRef.current.offsetHeight < newPosition &&
				footerRef.current.offsetTop > newPosition + menuRef.current.offsetHeight
			)
				setTop(`${newPosition}px`)
		} else setTop(`${newPosition}px`)
	}

	return isUserLoggedIn ? (
		<div
			ref={menuRef}
			className='left-menu'
			style={{ top: `${top}` }}
			onDragStart={e => setOffset(menuRef.current ? e.pageY - menuRef.current.offsetTop : 50)}
			onDragEnd={() => setOffset(0)}
			onDragOver={handleDrag}>
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
	) : null
}
