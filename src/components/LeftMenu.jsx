import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../AppContext'
import { UnreadMessagesBadge } from './common/'
import MapIcon from '@material-ui/icons/Public'
import CreateIcon from '@material-ui/icons/Create'
import MailIcon from '@material-ui/icons/MailOutline'
import ListBullet from '@material-ui/icons/FormatListBulleted'

export default function LeftMenu() {
	const menuRef = useRef()
	const [top, setTop] = useState('10%')
	const [offset, setOffset] = useState(0)
	const { userLoggedIn } = useContext(AppContext)

	return (
		<div className='outer-menu'>
			<div className='inner-menu' style={{ zIndex: userLoggedIn ? 1 : -1, opacity: userLoggedIn ? 1 : 0 }}>
				<div
					className='slider'
					ref={menuRef}
					style={{ top: `${top}` }}
					onDragStart={e => setOffset(menuRef.current ? e.pageY - menuRef.current.offsetTop : 50)}
					onDragOver={e => setTop(`${e.pageY - offset}px`)}
					draggable>
					<div className='left-menu'>
						<Link to='/map'>
							<MapIcon />
						</Link>
						<Link to='/users/dashboard/overview'>
							<ListBullet />
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
			</div>
		</div>
	)
}
