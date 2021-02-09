import React from 'react'

export const MessageMemo = React.memo(Message)
export default function Message({ props: { message, user_first_name, user_last_name, updated_at } }) {
	return (
		<div className='message'>
			{message} ({user_first_name} {user_last_name} @{updated_at})
		</div>
	)
}
