import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../AppContext'
import { UnreadMessagesBadge } from './common/'
import MapIcon from '@mui/icons-material/Public'
import CreateIcon from '@mui/icons-material/Create'
import MailIcon from '@mui/icons-material/MailOutline'
import ListBullet from '@mui/icons-material/FormatListBulleted'

export default function LeftMenu() {
  const menuRef = useRef()
  const [top, setTop] = useState('76px')
  const [offset, setOffset] = useState(0)
  const { userLoggedIn } = useContext(AppContext)

  return (
    <div className='outer-menu'>
      <div className='inner-menu' style={{ zIndex: userLoggedIn ? 2 : -1, opacity: userLoggedIn ? 1 : 0 }}>
        <div
          className='slider'
          ref={menuRef}
          style={{ top: `${top}` }}
          onDragStart={e => setOffset(menuRef.current ? e.pageY - menuRef.current.offsetTop : 50)}
          onDragOver={e => setTop(`${e.pageY - offset}px`)}
          draggable
        >
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
