import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { logError, isBlank } from './utilities'

export const AppContext = createContext()

export const AppContextProvider = props => {
	const [tokens, setTokens] = useState({ accessToken: '', refreshToken: undefined })
	const tokensRef = useRef()
	tokensRef.current = tokens

	const [cookie, setCookie, removeCookie] = useCookies(['longlived-auth', 'test'])
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

	// TODO: submitFetchRequest && fetchRequest could probably be refactored nicely
	const submitFetchRequest = useCallback(async (reqOptions, uriSuffix, callback = null) => {
		let resp
		let parsedResp
		let error
		console.log(reqOptions)
		try {
			resp = uriSuffix.includes('oauth')
				? await fetch(`http://localhost:3000/${uriSuffix}`, reqOptions)
				: await fetch(`http://localhost:3000/api/v1/${uriSuffix}`, reqOptions)
			parsedResp = await resp.json()
		} catch (_error) {
			// TODO: do something when there's no body, e.g. 401
			error = _error
			logError(error)
		}
		// Display error message automatically by triggering a banner update if server provided a display message or if try-catch is triggered
		if ((!resp && error) || (resp && 'error' in resp))
			setGlobals(g => {
				return {
					...g,
					bannerMessage:
						!parsedResp || isBlank(parsedResp.error.display_message)
							? 'An unexpected error has occured, please try again later.'
							: parsedResp.error.display_message,
					bannerType: 'danger',
					bannerTime: 5000,
					bannerTimestamp: isBlank(parsedResp) ? new Date().getTime() : parsedResp.error.timestamp,
				}
			})
		if (callback) callback(!resp ? { status: 500 } : resp, isBlank(parsedResp) ? {} : parsedResp)
	}, [])

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
			(resp, parsedResp) => {
				if (resp.status === 200) {
					setTokens({ accessToken: parsedResp.access_token, refreshToken: parsedResp.refresh_token })
					setGlobals({
						...globals,
						isUserLoggedIn: true,
						userEmail: email,
						bannerMessage: `Welcome back ${email}!`,
						bannerType: 'success',
						bannerTime: 3000,
					})
					// Adjust cookies
					if (rememberMe) createCookieAuth(parsedResp.cookie)
					else removeCookieAuth()
				} else {
					setTokens({ accessToken: '', refreshToken: '' })
					setGlobals({
						...globals,
						isUserLoggedIn: false,
						userEmail: '',
						bannerMessage: `Invalid username and/or password`,
						bannerType: 'danger',
						bannerTime: 4000,
					})
				}
				if (callback) callback(resp, parsedResp)
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
				(resp, parsedResp) => {
					if (resp.status === 200) {
						setTokens({ accessToken: parsedResp.access_token, refreshToken: parsedResp.refresh_token })
						setGlobals(g => {
							return {
								...g,
								isUserLoggedIn: true,
								userEmail: parsedResp.email,
								bannerMessage: `Welcome back ${parsedResp.email}!`,
								bannerType: 'success',
								bannerTime: 3000,
							}
						})
					} else {
						setTokens({ accessToken: '', refreshToken: '' })
						setGlobals(g => {
							return { ...g, isUserLoggedIn: false, userEmail: '' }
						})
						removeCookieAuth() // Delete cookie because it seems invalid
					}
				},
				false
			),
		[cookie, fetchRequest, removeCookieAuth]
	)

	const logOut = (callback = null) => {
		removeCookieAuth()
		fetchRequest(
			'POST',
			{ token: tokensRef.current.accessToken },
			'oauth/revoke',
			(r, pR) => {
				setTokens({ accessToken: '', refreshToken: '' })
				setGlobals({
					...globals,
					isUserLoggedIn: false,
					userEmail: '',
					bannerMessage: 'See you soon!',
					bannerType: 'success',
					bannerTime: 3000,
				})
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
					if (r.status === 200) {
						setTokens({ accessToken: pR.access_token, refreshToken: pR.refresh_token })
						setGlobals(g => {
							return { ...g, isUserLoggedIn: true, userEmail: pR.email }
						})
					} else {
						setTokens({ accessToken: '', refreshToken: '' })
						setGlobals(g => {
							return { ...g, isUserLoggedIn: false, userEmail: '' }
						})
					}
					if (callback) callback(r, pR)
				},
				false
			)
		},
		[fetchRequest]
	)

	const toggleBanner = (bM, bType, bTime = 5000) =>
		setGlobals({ ...globals, bannerMessage: bM, bannerType: bType, bannerTime: bTime })

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
		userEmail: '',
		logIn: logIn,
		logOut: logOut,
	})

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
				refreshToken(token, (r, pR) => r.status !== 200 && logInFromCookie())
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

	return <AppContext.Provider value={globals}>{props.children}</AppContext.Provider>
}
