import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react'

import { AppContext } from './AppContext'

export const AppData = createContext()
export const AppDataProvider = ({ children }) => {
	const { fetchRequest, isUserLoggedIn, userId, cable } = useContext(AppContext)
	const [fetchedHelpRequests, setFetchedHelpRequests] = useState([])
	const userIdRef = useRef()
	userIdRef.current = userId

	const refreshHelpRequests = () =>
		fetchRequest(
			'GET',
			null,
			'help_requests',
			(p, pR) => p.status === 200 && Array.isArray(pR) && setFetchedHelpRequests(pR),
			false
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

	const subToConvMessages = useCallback(
		convId =>
			cable.subscriptions.create(
				{ channel: 'MessagesChannel', conversation: convId },
				{
					received: m => setConversationMessages(convId, m),
				}
			),
		[cable]
	)

	// Handle conversations update
	useEffect(
		() =>
			isUserLoggedIn &&
			cable &&
			fetchRequest('GET', null, 'conversations', (r, pR) => {
				if (r.status === 200 && pR.length) {
					// Subscribe to each conversation MessagesChannel to receive new messages
					pR.forEach(c => subToConvMessages(c.id))
					setData(d => ({ ...d, conversations: pR.map(c => ({ ...c, messages: [] })) }))
				}
				// Subscribe to ConversationsChannel to be notified of newly created conversation
				cable.subscriptions.create(
					{ channel: 'ConversationsChannel' },
					{
						received: c =>
							setData(d => {
								const conversationsCopy = d.conversations
								const convIndex = conversationsCopy.findIndex(co => co.id === c.id)
								if (!d.conversations.length || convIndex !== -1) {
									conversationsCopy.push({ ...c, messages: [] })
									if (convIndex === -1) subToConvMessages(c.id)
								} else conversationsCopy[convIndex] = { ...c, messages: [] }
								return { ...d, conversations: conversationsCopy }
							}),
					}
				)
			}),
		[isUserLoggedIn, cable, fetchRequest, subToConvMessages]
	)

	// Augment fetchedHelpRequests with user associated help requests
	useEffect(() => {
		const _helpRequests = !data.userHelpRequests.length
			? !fetchedHelpRequests.length
				? []
				: fetchedHelpRequests.map(h => ({ ...h, managed: false }))
			: fetchedHelpRequests.map(h => {
					const index = data.userHelpRequests.find(uh => uh.id === h.id)
					return { ...h, managed: !index || index === -1 ? false : true }
			  })
		setData(d => ({ ...d, helpRequests: _helpRequests }))
	}, [fetchedHelpRequests, data.userHelpRequests])

	// Fetch user associated help requests on mount
	useEffect(
		() =>
			isUserLoggedIn &&
			cable &&
			fetchRequest('GET', null, 'help_requests/user', (p, pR) => {
				if (p.status === 200) {
					setData(d => ({ ...d, userHelpRequests: pR }))
					cable.subscriptions.create(
						{ channel: 'HelpRequestsChannel' },
						{
							received: h => handleHelpRequest(h),
						}
					)
				}
			}),
		[isUserLoggedIn, fetchRequest, cable]
	)

	// Handle help request notification
	const handleHelpRequest = h =>
		setData(d => {
			const helpRequestIndex = d.userHelpRequests.length
				? d.userHelpRequests.findIndex(uH => uH.id === h.id)
				: -1
			const userHelpRequestsCopy = d.userHelpRequests.length ? [...d.userHelpRequests] : []
			if (!h.users.length && helpRequestIndex !== -1) userHelpRequestsCopy.splice(helpRequestIndex, 1)
			else if (helpRequestIndex === -1) userHelpRequestsCopy.push(h)
			else userHelpRequestsCopy[helpRequestIndex] = h
			return { ...d, userHelpRequests: userHelpRequestsCopy }
		})

	return <AppData.Provider value={data}>{children}</AppData.Provider>
}
