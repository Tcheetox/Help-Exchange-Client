import React from 'react'

import { MessageMemo } from './Message'
import { LoadingSpinner } from '../common/'

export default function MessageArea({ conversation, loading }) {
	return (
		<div className='messages-area'>
			{loading ? (
				<LoadingSpinner />
			) : conversation.messages.length ? (
				conversation.messages.map((m, k) => <MessageMemo props={m} key={k} />)
			) : (
				<h4>You're yet to communicate with this guy!</h4>
			)}
		</div>
	)
}
