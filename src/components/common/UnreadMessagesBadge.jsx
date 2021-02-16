import React, { useState, useEffect, useContext } from 'react'

import { AppData } from '../../AppData'
import Badge from 'react-bootstrap/Badge'

export default function UnreadMessagesBadge({ convId = -1 }) {
	const { conversations } = useContext(AppData)
	const [unreadMessages, setUnreadMessages] = useState(0)

	useEffect(() => {
		if (conversations.length) {
			if (convId === -1) setUnreadMessages(conversations.reduce((prev, cur) => prev + cur.unread_messages, 0))
			else
				setUnreadMessages(
					conversations.filter(c => c.id === convId).reduce((prev, cur) => prev + cur.unread_messages, 0)
				)
		}
	}, [conversations, convId])

	return (
		<>
			{unreadMessages > 0 ? (
				<Badge className='unread' variant='primary' pill>
					{unreadMessages}
				</Badge>
			) : null}
		</>
	)
}
