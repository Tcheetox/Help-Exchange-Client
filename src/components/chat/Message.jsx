import React, { useContext } from 'react'

import dateFormat from 'dateformat'
import { AppContext } from '../../AppContext'

export const MessageMemo = React.memo(Message)
export default function Message({ props: { message, user_id, updated_at } }) {
	const { userId } = useContext(AppContext)
	return (
		<div className={`message ${userId === user_id ? 'owner' : 'target'}`}>
			{message}
			<div className='time'>
				{new Date().getFullYear().toString() !== dateFormat(updated_at, 'yyyy')
					? dateFormat(updated_at, 'mmm dd yyyy, hh:mm')
					: dateFormat(updated_at, 'mmm dd, hh:mm')}
			</div>
		</div>
	)
}
