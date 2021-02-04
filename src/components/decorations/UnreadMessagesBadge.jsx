import React, { useState, useEffect, useContext } from 'react'

import { AppContext } from '../../AppContext'
import Badge from 'react-bootstrap/Badge'

export default function UnreadMessagesBadge({ convId = -1 }) {
	const { conversations } = useContext(AppContext)
	const [unreadMessages, setUnreadMessages] = useState(0)
	useEffect(() => {
		if (conversations.length) {
			if (convId === -1) setUnreadMessages(conversations.reduce((prev, cur) => prev + cur.unread_messages, 0))
			else
				setUnreadMessages(
					conversations.filter(c => c.id === convId).reduce((prev, cur) => prev + cur.unread_messages, 0)
				)
		}
	}, [conversations])

	return <>{unreadMessages > 0 ? <Badge variant='primary'>{unreadMessages}</Badge> : null}</>
}
