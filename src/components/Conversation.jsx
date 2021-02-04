import React, { useState, useEffect, useContext, useRef } from 'react'

import { AppContext } from '../AppContext'
import DoublePane from './decorations/DoublePane'
import MessagesArea from './MessagesArea'
import InputForm from './decorations/InputForm'
import LoadingButton from './decorations/LoadingButton'
import LoadingSpinner from './decorations/LoadingSpinner'
import UnreadMessagesBadge from './decorations/UnreadMessagesBadge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

export default function Conversation() {
	const leftPaneWidth = 3
	const subscriptionRef = useRef()
	const { fetchRequest, isUserLoggedIn, userId, cable, conversations, setConversationMessages } = useContext(
		AppContext
	)
	const [activeConversation, setActiveConversation] = useState(0)
	const [message, setMessage] = useState('')

	// TODO: loading spinner

	// Fetch full conversation if necessary, restore subscription
	useEffect(() => {
		if (isUserLoggedIn && activeConversation > 0) {
			const conversation = conversations.find(c => c.id === activeConversation)
			if (conversation && conversation.messages.length !== conversation.total_messages)
				fetchRequest(
					'GET',
					null,
					`conversations/${activeConversation}`,
					(r, pR) => r.status === 200 && pR.length && setConversationMessages(activeConversation, pR)
				)
			// Set reference to proper MessagesChannel
			if (cable && !subscriptionRef.current)
				subscriptionRef.current = cable.subscriptions.subscriptions.find(
					sub => sub.identifier.includes('MessagesChannel') && sub.identifier.includes(activeConversation)
				)
		}
	}, [isUserLoggedIn, fetchRequest, activeConversation, cable, setConversationMessages, conversations])

	// Mark active conversation messages as read
	useEffect(() => {
		if (isUserLoggedIn && subscriptionRef.current && activeConversation > 0) {
			const conversation = { ...conversations.find(c => c.id === activeConversation) }
			let conversationUpdated = false
			if (conversation && conversation.messages.length)
				conversation.messages.forEach((m, i) => {
					if (m.user_id !== userId && m.status === 'unread') {
						conversationUpdated = true
						conversation.messages[i] = { ...m, status: 'read' }
						subscriptionRef.current.send({ action: 'mark_as_read', content: m.id })
					}
				})
			if (conversationUpdated) setConversationMessages(activeConversation, conversation.messages)
		}
	}, [conversations, userId, isUserLoggedIn, setConversationMessages, activeConversation])

	const onSubmit = e => {
		e.preventDefault()
		if (message.length && isUserLoggedIn && subscriptionRef.current) {
			setMessage('')
			subscriptionRef.current.send({ action: 'new_message', content: message })
		}
	}

	const conversationTitle = c => (
		<div className='title'>
			<div className='request'>{c.help_request_title}</div>
			<div className='user'>
				{c.target_user_first_name} {c.target_user_last_name}
			</div>
			<UnreadMessagesBadge convId={c.id} />
		</div>
	)

	return (
		<div className='conversation'>
			<DoublePane leftPane={leftPaneWidth} setActivePane={p => setActiveConversation(p.conversation.id)}>
				{conversations.map(c => (
					<MessagesArea key={c.id} title={conversationTitle(c)} conversation={c} />
				))}
			</DoublePane>
			<Card className='input-area'>
				<Row>
					<Col lg={leftPaneWidth}></Col>
					<Col lg={12 - leftPaneWidth}>
						<Card.Body>
							<Form onSubmit={onSubmit}>
								<Row>
									<InputForm name='message' value={message} onChange={e => setMessage(e.target.value)} />
									<LoadingButton variant='primary' type='submit'>
										Submit
									</LoadingButton>
								</Row>
							</Form>
						</Card.Body>
					</Col>
				</Row>
			</Card>
		</div>
	)
}
