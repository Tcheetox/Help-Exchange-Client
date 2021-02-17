import React from 'react'

import dateFormat from 'dateformat'

export const MessageMemo = React.memo(Message)
export default function Message({ props: { message, user_id, updated_at, current_year, current_user_id } }) {
	return (
		<div className={`message ${current_user_id === user_id ? 'owner' : 'target'}`}>
			{message}
			<div className='time'>
				{current_year !== dateFormat(updated_at, 'yyyy')
					? dateFormat(updated_at, 'mmm dd yyyy, hh:mm')
					: dateFormat(updated_at, 'mmm dd, hh:mm')}
			</div>
		</div>
	)
}
