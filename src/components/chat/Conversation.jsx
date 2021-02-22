import React, { useState, useEffect, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { AppContext } from '../../AppContext'
import { AppData } from '../../AppData'
import MessagesArea from './MessagesArea'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import SendIcon from '@material-ui/icons/Send'
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos'
import { DoublePane, InputForm, LoadingButton, UnreadMessagesBadge } from '../common/'

export default function Conversation({ defaultActivePane }) {
	const leftPaneWidth = 3
	const subscriptionRef = useRef()
	const history = useHistory()
	const [loading, setLoading] = useState(false)
	const { fetchRequest, userLoggedIn, userId, cable } = useContext(AppContext)
	const { conversations, setConversationMessages } = useContext(AppData)
	const [activeConversation, setActiveConversation] = useState(0)
	const [message, setMessage] = useState('')
	const [messageToMonitor, setMessageToMonitor] = useState({})
	const [display, setDisplay] = useState(0)

	// Fetch full conversation if necessary, switch to proper subscription to be able to send messages
	useEffect(() => {
		if (userLoggedIn && activeConversation > 0) {
			const conversation = conversations.find(c => c.id === activeConversation)
			if (conversation && conversation.messages.length !== conversation.total_messages) {
				setLoading(true)
				fetchRequest('GET', null, `conversations/${activeConversation}`, (r, pR) => {
					if (r.status === 200 && pR.length) setConversationMessages(activeConversation, pR)
					setLoading(false)
				})
			}
			// Set reference to proper MessagesChannel
			if (cable)
				subscriptionRef.current = cable.subscriptions.subscriptions.find(
					sub => sub.identifier.includes('MessagesChannel') && sub.identifier.includes(activeConversation)
				)
		}
	}, [userLoggedIn, fetchRequest, activeConversation, cable, setConversationMessages, conversations])

	// Mark active conversation messages as read
	useEffect(() => {
		if (userLoggedIn && userId !== -1 && subscriptionRef.current && activeConversation > 0) {
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
	}, [conversations, userId, userLoggedIn, setConversationMessages, activeConversation])

	const onSubmit = e => {
		e.preventDefault()
		if (message.length && userLoggedIn && subscriptionRef.current) {
			setDisplay(1)
			setMessageToMonitor({ conversation: activeConversation, message: message })
			subscriptionRef.current.send({ action: 'new_message', content: message })
			setMessage('')
		}
	}

	// Monitor that last message sent has been sent (and received back in response) successfully
	useEffect(() => {
		const targetConv = conversations.find(c => c.id === messageToMonitor.conversation)
		if (targetConv && display === 1) {
			const messageSent = targetConv.messages.find(m => m.message === messageToMonitor.message)
			if (messageSent && messageSent.user_id === userId) setDisplay(0)
		}
	}, [messageToMonitor, conversations, userId, display])

	const conversationTitle = c => (
		<div className='title'>
			<div className='request'>{c.help_request_title}</div>
			<div className='user'>
				<ArrowBackIcon
					onClick={e => {
						e.stopPropagation()
						history.push(`/users/dashboard/overview/${c.help_request_id}`)
					}}
				/>
				{c.target_user_first_name} {c.target_user_last_name} <UnreadMessagesBadge convId={c.id} />
			</div>
		</div>
	)

	const defaultConversation = () => {
		if (conversations.length) {
			const convIndex = conversations.findIndex(c => c.id === defaultActivePane)
			return convIndex !== -1 ? convIndex : 0
		}
	}

	return (
		<div className='conversation'>
			{conversations.length ? (
				<>
					<DoublePane
						leftPane={leftPaneWidth}
						setActivePane={p => setActiveConversation(p.conversation.id)}
						defaultActivePane={defaultConversation()}>
						{conversations.map(c => (
							<MessagesArea key={c.id} title={conversationTitle(c)} conversation={c} loading={loading} />
						))}
					</DoublePane>
					<Card className='input-area'>
						<Row>
							<Col lg={leftPaneWidth}></Col>
							<Col lg={12 - leftPaneWidth}>
								<Card.Body>
									<Form onSubmit={onSubmit}>
										<Row>
											<InputForm
												name='message'
												value={message}
												onChange={e => setMessage(e.target.value)}
												display={display}
											/>
											<LoadingButton className='send plain-blue' type='submit' display={display}>
												<SendIcon />
											</LoadingButton>
										</Row>
									</Form>
								</Card.Body>
							</Col>
						</Row>
					</Card>
				</>
			) : (
				<h4>You don't have any conversations yet</h4>
			)}
		</div>
	)
}
