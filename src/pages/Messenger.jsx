import React, { useState, useEffect, useContext } from 'react'

import Cable from '../components/Cable'
import ConversationHandler from '../components/ConversationHandler'

import MessagesArea from '../components/MessagesArea'
import { ActionCableConsumer } from 'react-actioncable-provider'

import { AppContext } from '../AppContext'

export default function Messenger() {
	const { fetchRequest, isUserLoggedIn } = useContext(AppContext)
	const [conversations, setConversations] = useState([])
	const [activeConversation, setActiveConversation] = useState(null)

	useEffect(() => {
		if (isUserLoggedIn)
			fetchRequest('GET', null, 'conversations', (r, pR) => {
				console.log('RECEIVED CONVS from messenger')
				console.log(pR)
				if (r.status === 200 && Array.isArray(pR)) setConversations(pR)
			})
	}, [isUserLoggedIn])

	const handleClick = id => setActiveConversation(id)

	const handleReceivedConversation = response => {
		console.log('RECEIVED CONVO +')
		console.log(response)
		// console.log(response)
		// const { conv } = response
		setConversations([...conversations, response]) // TODO: use previous conversations?
	}

	const handleReceivedMessage = response => {
		const { chat } = response
		const conversationsCopy = [...conversations]
		const conv = conversationsCopy.find(conversation => conversation.id === chat.conversation_id)
		conv.chats = [...conv.chats, chat]
		setConversations(conversationsCopy)
	}

	const findActiveConversation = (convs, activeConv) => {
		return convs.find(conv => conv.id === activeConv)
	}

	const mapConversations = (convs, handleClickCB) => {
		return convs.map(conversation => {
			return (
				<li key={conversation.id} onClick={() => handleClickCB(conversation.id)}>
					{conversation.id}
				</li>
			)
		})
	}

	return (
		<>
			<ActionCableConsumer
				channel={{ channel: 'ConversationsChannel' }}
				onReceived={handleReceivedConversation}
			/>
			{conversations.length ? (
				<>
					<Cable conversations={conversations} handleReceivedMessage={handleReceivedMessage} />
					<ConversationHandler conversations={conversations} />
				</>
			) : null}
			{/* <h2>Conversations</h2>
			 <ul>{conversations.map(conv => (conv ? <li>{conv.id}</li> : null))}</ul> 
			<ul>
				{conversations.map(conv => (
					<li>{conv.id}</li>
				))}
			</ul>
			 <ul>{mapConversations(conversations, handleClick)}</ul> 
			 <NewConversationForm /> 
			{activeConversation ? (
				<MessagesArea conversation={findActiveConversation(conversations, activeConversation)} />
			) : null} */}
		</>
	)
}
