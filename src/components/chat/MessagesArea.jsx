import React, { useEffect, useRef, useContext } from 'react'

import { MessageMemo } from './Message'
import { LoadingSpinner } from '../common/'
import { logError } from '../../utilities'
import { AppContext } from '../../AppContext'

export default function MessageArea({ conversation, loading }) {
	const messagesAreaRef = useRef()
	const { userId } = useContext(AppContext)
	const currentYear = new Date().getFullYear().toString()

	// Auto-scroll until last message sent
	useEffect(() => {
		if (!loading && conversation.messages.length && messagesAreaRef.current) {
			if (messagesAreaRef.current.childNodes && messagesAreaRef.current.childNodes.length > 1)
				autoScroll('auto')
		}
	}, [conversation.messages.length, loading])

	const autoScroll = behavior => {
		try {
			let targetNode
			for (let i = messagesAreaRef.current.childNodes.length - 1; i >= 0; i--)
				if (messagesAreaRef.current.childNodes[i].className === 'message owner') {
					targetNode = messagesAreaRef.current.childNodes[i]
					break
				}
			// Scroll
			const scrollHeight =
				targetNode.offsetTop - targetNode.offsetParent.offsetHeight + targetNode.offsetHeight + 6
			messagesAreaRef.current.scrollBy({ left: 0, top: scrollHeight, behavior: behavior })
		} catch (error) {
			logError(error)
		}
	}

	return (
		<div className='messages-area' ref={messagesAreaRef}>
			{loading ? (
				<LoadingSpinner />
			) : conversation.messages.length ? (
				conversation.messages.map((m, k) => (
					<MessageMemo props={{ ...m, current_year: currentYear, current_user_id: userId }} key={k} />
				))
			) : (
				<h4>You're yet to communicate with this person.</h4>
			)}
		</div>
	)
}
