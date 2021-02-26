import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react'

import { AppContext } from './AppContext'

export const AppData = createContext()
export const AppDataProvider = ({ children }) => {
	const { fetchRequest, userLoggedIn, userId, cable } = useContext(AppContext)
	const userIdRef = useRef()
	userIdRef.current = userId

	const refreshHelpRequests = useCallback(
		() =>
			fetchRequest(
				'GET',
				null,
				'help_requests',
				(r, pR) => r.status === 200 && setData(d => ({ ...d, helpRequests: pR })),
				false
			),
		[fetchRequest]
	)

	// Update an existing conversation with new messages
	const setConversationMessages = (convId, messages) =>
		setData(d => {
			const convCopy = [...d.conversations]
			const convIndex = convCopy.findIndex(c => c.id === convId)
			if (convIndex !== -1) {
				if (Array.isArray(messages)) {
					convCopy[convIndex].messages = messages
					convCopy[convIndex].total_messages = convCopy[convIndex].messages.length
				} else {
					convCopy[convIndex].messages.push(messages)
					convCopy[convIndex].total_messages += 1
				}
				let unreadMessages = 0
				convCopy[convIndex].messages.forEach(m =>
					m.status === 'unread' && m.user_id !== userIdRef.current ? (unreadMessages += 1) : null
				)
				convCopy[convIndex].unread_messages = unreadMessages
				convCopy[convIndex].updated_at =
					convCopy[convIndex].messages[convCopy[convIndex].messages.length - 1].updated_at
			}
			return {
				...d,
				conversations: convCopy,
			}
		})

	const [data, setData] = useState({
		helpRequests: [],
		refreshHelpRequests: refreshHelpRequests,
		userHelpRequests: [],
		conversations: [],
		setConversationMessages: setConversationMessages,
	})

	// Clear cache when disconnected
	useEffect(
		() =>
			!userLoggedIn && setData(d => ({ ...d, helpRequests: [], userHelpRequests: [], conversations: [] })),
		[userLoggedIn]
	)

	const subToConvMessages = useCallback(
		convId =>
			cable.subscriptions.create(
				{ channel: 'MessagesChannel', conversation: convId },
				{
					received: m => {
						if (process.env['REACT_APP_DEBUG'] === 'true') {
							console.log('WS received - MessagesChannel:')
							console.log(m)
						}
						setConversationMessages(convId, m)
					},
				}
			),
		[cable]
	)

	// Initial fetch of (all published) help requests (this action is done again each time the user visits the map)
	useEffect(() => refreshHelpRequests(), [refreshHelpRequests])

	// Handle conversations update
	useEffect(
		() =>
			userLoggedIn &&
			cable &&
			fetchRequest('GET', null, 'conversations', (r, pR) => {
				if (r.status === 200 && pR.length) {
					// Subscribe to each conversation MessagesChannel to receive new messages
					pR.forEach(c => subToConvMessages(c.id))
					setData(d => ({
						...d,
						conversations: pR
							.map(c => ({ ...c, messages: [] }))
							.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
					}))
				}
				// Subscribe to ConversationsChannel to be notified of newly created conversation
				cable.subscriptions.create(
					{ channel: 'ConversationsChannel' },
					{
						received: c => {
							if (process.env['REACT_APP_DEBUG'] === 'true') {
								console.log('WS received - ConversationsChannel:')
								console.log(c)
							}
							setData(d => {
								const conversationsCopy = d.conversations
								const convIndex = conversationsCopy.findIndex(co => co.id === c.id)
								if (!convIndex || convIndex === -1) {
									conversationsCopy.push({ ...c, messages: [] })
									subToConvMessages(c.id)
								} else conversationsCopy[convIndex] = { ...c, messages: [] }
								return {
									...d,
									conversations: conversationsCopy.sort(
										(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
									),
								}
							})
						},
					}
				)
			}),
		[userLoggedIn, cable, fetchRequest, subToConvMessages]
	)

	// Handle help request notification
	const handleHelpRequest = useCallback(
		h =>
			setData(d => {
				const helpRequestIndex = d.userHelpRequests.length
					? d.userHelpRequests.findIndex(uH => uH.id === h.id)
					: -1
				const userHelpRequestsCopy = d.userHelpRequests.length ? [...d.userHelpRequests] : []
				if (helpRequestIndex !== -1 && !h.users.find(u => u.id === userId))
					userHelpRequestsCopy.splice(helpRequestIndex, 1)
				else if (helpRequestIndex === -1) userHelpRequestsCopy.push(h)
				else userHelpRequestsCopy[helpRequestIndex] = h
				return {
					...d,
					userHelpRequests: userHelpRequestsCopy.sort(
						(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
					),
				}
			}),
		[userId]
	)

	// Fetch user associated help requests on mount
	useEffect(
		() =>
			userLoggedIn &&
			cable &&
			fetchRequest('GET', null, 'help_requests/filter', (p, pR) => {
				if (p.status === 200) {
					setData(d => ({
						...d,
						userHelpRequests: pR.length
							? pR.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
							: [],
					}))
					cable.subscriptions.create(
						{ channel: 'HelpRequestsChannel' },
						{
							received: h => {
								if (process.env['REACT_APP_DEBUG'] === 'true') {
									console.log('WS received - HelpRequestsChannel:')
									console.log(h)
								}
								handleHelpRequest(h)
							},
						}
					)
				}
			}),
		[userLoggedIn, fetchRequest, cable, handleHelpRequest]
	)

	return <AppData.Provider value={data}>{children}</AppData.Provider>
}
