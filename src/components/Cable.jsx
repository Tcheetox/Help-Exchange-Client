import React from 'react'
import { ActionCableConsumer } from 'react-actioncable-provider'

export default function Cable({ conversations, handleReceivedMessage }) {
	return (
		<>
			{conversations.map(conversation => {
				return (
					<ActionCableConsumer
						key={conversation.id}
						channel={{ channel: 'MessagesChannel', conversation: conversation.id }}
						onReceived={handleReceivedMessage}
					/>
				)
			})}
		</>
	)
}
