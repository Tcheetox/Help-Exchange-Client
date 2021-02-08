import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { AppDataProvider } from './AppData'
import { useCookies } from 'react-cookie'
import { logError, isBlank } from './utilities'
import { AutomaticMessage, WelcomeBack, InvalidCredentials, GoodBye } from './components/bannerMessages'
import ActionCable from 'actioncable'

export const AppContext = createContext()

export const AppContextProvider = props => {
	const [tokens, setTokens] = useState({ accessToken: '', refreshToken: undefined })
	const tokensRef = useRef()
	tokensRef.current = tokens

	const [cookie, setCookie, removeCookie] = useCookies(['longlived-auth'])
	const handleCookie = useCallback(
		(name, create, val = null) => {
			const date = new Date()
			const cookieOptions = {
				path: '/',
				secure: true,
				sameSite: 'strict',
				expires: new Date(date.setMonth(date.getMonth() + 2)),
			}
			if (create) setCookie(name, val, cookieOptions)
			else removeCookie(name, cookieOptions)
		},
		[setCookie, removeCookie]
	)
	const createCookieAuth = useCallback(_cookie => handleCookie('longlived-auth', true, _cookie), [
		handleCookie,
	])
	const removeCookieAuth = useCallback(() => handleCookie('longlived-auth', false), [handleCookie])

	const toggleBanner = useCallback(
		args =>
			setGlobals(g => {
				return {
					...g,
					bannerMessage: args[0],
					bannerType: args[1],
					bannerTime: args.length > 2 ? args[2] : 5000,
					bannerTimestamp: args.length > 3 ? args[3] : new Date().getTime(),
				}
			}),
		[]
	)

	const submitFetchRequest = useCallback(
		async (reqOptions, uriSuffix, callback = null) => {
			let resp
			let parsedResp
			let error
			try {
				resp = uriSuffix.includes('oauth')
					? await fetch(`${process.env.REACT_APP_API_PREFIX}/${uriSuffix}`, reqOptions)
					: await fetch(
							`${process.env.REACT_APP_API_PREFIX}/api/${process.env.REACT_APP_API_VERSION}/${uriSuffix}`,
							reqOptions
					  )
				parsedResp = await resp.json()
			} catch (_error) {
				error = _error
				logError(error)
			}
			// Display error message automatically by triggering a banner update if server provided a display message or if try-catch is triggered
			if ((!resp && error) || (resp && resp.status === 500)) {
				toggleBanner(
					parsedResp && 'error' in parsedResp
						? AutomaticMessage(parsedResp.error.display_message, parsedResp.error.timestamp)
						: AutomaticMessage()
				)
			}
			if (callback) callback(!resp ? { status: 500 } : resp, isBlank(parsedResp) ? {} : parsedResp)
		},
		[toggleBanner]
	)

	const fetchRequest = useCallback(
		async (method, body, uriSuffix, callback = null, useToken = true) => {
			const reqHeaders = useToken
				? { 'Content-Type': 'application/json', Authorization: `Bearer ${tokensRef.current.accessToken}` }
				: { 'Content-Type': 'application/json' }
			const reqBody =
				method === 'HEAD' || method === 'GET' || !body
					? null
					: useToken
					? JSON.stringify({ ...body })
					: JSON.stringify({
							...body,
							client_id: process.env.REACT_APP_CLIENT_ID,
							client_secret: process.env.REACT_APP_CLIENT_SECRET,
					  })
			submitFetchRequest({ method: method, headers: reqHeaders, body: reqBody }, uriSuffix, callback)
		},
		[submitFetchRequest]
	)

	const fetchFileRequest = useCallback(
		async (method, fileType, file, uriSuffix, callback = null) => {
			const reqHeaders = { Authorization: `Bearer ${tokensRef.current.accessToken}` }
			var formData = new FormData()
			formData.append('file_type', fileType)
			formData.append('file', file)
			submitFetchRequest({ method: method, headers: reqHeaders, body: formData }, uriSuffix, callback)
		},
		[submitFetchRequest]
	)

	const logIn = (email, password, rememberMe, callback = null) =>
		fetchRequest(
			'POST',
			{ email: email, password: password, grant_type: 'password' },
			'oauth/token',
			(r, pR) => {
				if (r.status === 200) {
					storeLogIn(pR.id, pR.email, pR.access_token, pR.refresh_token)
					toggleBanner(WelcomeBack(email, pR.completed))
					if (rememberMe) createCookieAuth(pR.cookie)
					else removeCookieAuth()
				} else {
					storeLogOut()
					if (r.status === 400 || r.status === 401) toggleBanner(InvalidCredentials())
				}
				if (callback) callback(r, pR)
			},
			false
		)

	const logInFromCookie = useCallback(
		() =>
			Object.keys(cookie).length > 0 &&
			cookie['longlived-auth'] !== '' &&
			fetchRequest(
				'POST',
				{ cookie: cookie['longlived-auth'], grant_type: 'password' },
				'oauth/token',
				(r, pR) => {
					if (r.status === 200) {
						storeLogIn(pR.id, pR.email, pR.access_token, pR.refresh_token)
						toggleBanner(WelcomeBack(pR.email, pR.completed))
					} else {
						storeLogOut()
						removeCookieAuth() // Delete cookie because it seems invalid
					}
				},
				false
			),
		[cookie, fetchRequest, removeCookieAuth, toggleBanner]
	)

	const logOut = (callback = null) => {
		removeCookieAuth()
		fetchRequest(
			'POST',
			{ token: tokensRef.current.accessToken },
			'oauth/revoke',
			(r, pR) => {
				storeLogOut()
				toggleBanner(GoodBye())
				if (callback) callback(r, pR)
			},
			false
		)
	}

	const refreshToken = useCallback(
		(token, callback = null) => {
			fetchRequest(
				'POST',
				{ grant_type: 'refresh_token', refresh_token: token },
				'oauth/token',
				(r, pR) => {
					if (r.status === 200) storeLogIn(pR.id, pR.email, pR.access_token, pR.refresh_token)
					else storeLogOut()
					if (callback) callback(r, pR)
				},
				false
			)
		},
		[fetchRequest]
	)

	const storeLogIn = (id, email, access_token, refresh_token) => {
		setTokens({ accessToken: access_token, refreshToken: refresh_token })
		setGlobals(g => ({ ...g, isUserLoggedIn: true, userId: id, userEmail: email }))
	}

	// TODO: nasty
	const storeLogOut = () => {
		setTokens({ accessToken: '', refreshToken: '' })
		setGlobals(g => ({
			...g,
			isUserLoggedIn: false,
			userId: -1,
			userEmail: '',
			userProfile:
				g.userProfile && g.userProfile.lat && g.userProfile.lng
					? { lat: g.userProfile.lat, lng: g.userProfile.lng }
					: { lat: null, lng: null },
		}))
	}

	// The globals object is accessible through the whole app through useContext
	const [globals, setGlobals] = useState({
		bannerMessage: '',
		bannerType: '',
		bannerTime: 0,
		bannerTimestamp: '',
		toggleBanner: toggleBanner,
		fetchRequest: fetchRequest,
		fetchFileRequest: fetchFileRequest,
		isUserLoggedIn: false,
		userId: -1,
		userEmail: '',
		userProfile: null,
		cable: null,
		logIn: logIn,
		logOut: logOut,
	})

	// Fetch and store profile
	useEffect(
		() =>
			globals.isUserLoggedIn &&
			fetchRequest(
				'GET',
				null,
				'users/edit',
				(r, pR) => r.status === 200 && setGlobals(g => ({ ...g, userProfile: pR }))
			),
		[globals.isUserLoggedIn, fetchRequest]
	)

	// Handle Websocket connection
	useEffect(() => {
		if (globals.isUserLoggedIn && !globals.cable) {
			let appCable = {}
			appCable.cable = ActionCable.createConsumer(
				`${process.env.REACT_APP_WS_API_PREFIX}/api/${process.env.REACT_APP_API_VERSION}/users/${tokensRef.current.accessToken}/cable`
			)
			setGlobals(g => ({ ...g, cable: appCable.cable }))
		} else if (!globals.isUserLoggedIn && globals.cable) {
			globals.cable.disconnect()
			setGlobals(g => ({ ...g, cable: null }))
		}
	}, [globals.isUserLoggedIn, globals.cable])

	// Handle session auth
	useEffect(() => {
		if (tokens.refreshToken !== undefined) {
			if (tokens.refreshToken === '') sessionStorage.removeItem('shortlived-auth')
			else sessionStorage.setItem('shortlived-auth', tokens.refreshToken)
		}
	}, [tokens.refreshToken])

	// Attempt to authenticate user automatically
	useEffect(() => {
		if (!globals.isUserLoggedIn) {
			const token = sessionStorage.getItem('shortlived-auth')
			if (token && tokensRef.current.refreshToken !== '') {
				refreshToken(token, r => r.status !== 200 && logInFromCookie())
			} else logInFromCookie()
		}
	}, [globals.isUserLoggedIn, cookie, logInFromCookie, refreshToken])

	// Automatic token refresh
	useEffect(() => {
		let intervalId
		if (!isBlank(tokens.refreshToken) && globals.isUserLoggedIn)
			intervalId = setInterval(() => refreshToken(tokens.refreshToken), 600000) // Runs every 10 min because token expires after 15 min
		return () => clearInterval(intervalId)
	}, [tokens.refreshToken, globals.isUserLoggedIn, refreshToken])

	return (
		<AppContext.Provider value={globals}>
			<AppDataProvider>{props.children}</AppDataProvider>
		</AppContext.Provider>
	)
}
