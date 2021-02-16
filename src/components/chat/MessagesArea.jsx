import React, { useEffect, useRef } from 'react'

import { MessageMemo } from './Message'
import { LoadingSpinner } from '../common/'
import { logError } from '../../utilities'

export default function MessageArea({ conversation, loading }) {
	const messagesAreaRef = useRef()

	// Auto-scroll until last message sent
	useEffect(() => {
		let timer
		if (conversation.messages.length && messagesAreaRef.current) {
			if (messagesAreaRef.current.childNodes && messagesAreaRef.current.childNodes.length > 1)
				autoScroll('auto')
			else timer = setTimeout(() => autoScroll('smooth'), 300)
		}
		return () => clearTimeout(timer)
	}, [conversation.messages.length])

	const autoScroll = behavior => {
		try {
			if (
				messagesAreaRef.current &&
				messagesAreaRef.current.childNodes &&
				messagesAreaRef.current.childNodes.length > 1
			) {
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
			}
		} catch (error) {
			logError(error)
		}
	}

	return (
		<div className='messages-area' ref={messagesAreaRef}>
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
