import React from 'react'

export default function MessageArea({ conversation }) {
	return (
		<div className='messages-area'>
			{conversation.messages.length ? (
				conversation.messages.map((m, k) => (
					<div key={k}>
						{m.message} ({m.user_first_name} {m.user_last_name} @{m.updated_at})
					</div>
				))
			) : (
				<h4>You're yet to communicate with this guy!</h4>
			)}
		</div>
	)
}
