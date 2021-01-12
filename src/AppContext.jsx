import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { logError, isBlank } from './utilities'

export const AppContext = createContext()

export const AppContextProvider = props => {
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

	const fetchRequest = useCallback(async (method, body, uriSuffix, token = null, callback = null) => {
		// Build request
		const reqOptions = {
			method: method,
			headers: token
				? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
				: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...body,
				client_id: process.env.REACT_APP_CLIENT_ID,
				client_secret: process.env.REACT_APP_CLIENT_SECRET,
			}),
		}
		// Submit request and fetch result
		let resp
		let parsedResp
		let error
		try {
			resp = uriSuffix.includes('oauth')
				? await fetch(`http://localhost:3000/${uriSuffix}`, reqOptions)
				: await fetch(`http://localhost:3000/api/v1/${uriSuffix}`, reqOptions)
			parsedResp = await resp.json()
		} catch (_error) {
			error = _error
			logError(error)
		}
		// Display error message automatically by triggering a banner update if server provided a display message or if try-catch is triggered
		if (error || ('error' in parsedResp && parsedResp.error.display_message !== ''))
			setGlobals(g => {
				return {
					...g,
					bannerMessage: isBlank(parsedResp)
						? 'An unexpected error has occured, please try again later.'
						: parsedResp.error.display_message,
					bannerType: 'danger',
					bannerTime: 5000,
					bannerTimestamp: isBlank(parsedResp) ? new Date().getTime() : parsedResp.error.timestamp,
				}
			})
		if (callback) callback(error ? { status: 500 } : resp, error ? {} : parsedResp)
	}, [])

	const logIn = (email, password, rememberMe, callback = null) =>
		fetchRequest(
			'POST',
			{ email: email, password: password, grant_type: 'password' },
			'oauth/token',
			null,
			(resp, parsedResp) => {
				if (resp.status === 200) {
					setGlobals({
						...globals,
						isUserLoggedIn: true,
						userToken: parsedResp.access_token,
						userRefreshToken: parsedResp.refresh_token,
						userEmail: email,
						bannerMessage: `Welcome back ${email}!`,
						bannerType: 'success',
						bannerTime: 3000,
					})
					// Adjust cookies
					if (rememberMe) createCookieAuth(parsedResp.cookie)
					else removeCookieAuth()
				} else
					setGlobals({
						...globals,
						isUserLoggedIn: false,
						userToken: '',
						userRefreshToken: '',
						userEmail: '',
						bannerMessage: `Invalid username and/or password`,
						bannerType: 'danger',
						bannerTime: 4000,
					})
				if (callback) callback(resp, parsedResp)
			}
		)

	const logInFromCookie = useCallback(
		() =>
			Object.keys(cookie).length > 0 &&
			cookie['longlived-auth'] !== '' &&
			fetchRequest(
				'POST',
				{ cookie: cookie['longlived-auth'], grant_type: 'password' },
				'oauth/token',
				null,
				(resp, parsedResp) => {
					if (resp.status === 200)
						setGlobals(g => {
							return {
								...g,
								isUserLoggedIn: true,
								userToken: parsedResp.access_token,
								userRefreshToken: parsedResp.refresh_token,
								userEmail: parsedResp.email,
								bannerMessage: `Welcome back ${parsedResp.email}!`,
								bannerType: 'success',
								bannerTime: 3000,
							}
						})
					else {
						setGlobals(g => {
							return { ...g, isUserLoggedIn: false, userToken: '', userRefreshToken: '', userEmail: '' }
						})
						removeCookieAuth() // Delete cookie because it seems invalid
					}
				}
			),
		[cookie, fetchRequest, removeCookieAuth]
	)

	const logOut = (callback = null) => {
		removeCookieAuth()
		fetchRequest('POST', { token: globals.userToken }, 'oauth/revoke', null, (r, pR) => {
			setGlobals({
				...globals,
				isUserLoggedIn: false,
				userToken: '',
				userRefreshToken: '',
				userEmail: '',
				bannerMessage: 'See you soon!',
				bannerType: 'success',
				bannerTime: 3000,
			})
			if (callback) callback(r, pR)
		})
	}

	const refreshToken = useCallback(
		(token, callback = null) =>
			fetchRequest(
				'POST',
				{ grant_type: 'refresh_token', refresh_token: token },
				'oauth/token',
				null,
				(r, pR) => {
					setGlobals(g =>
						r.status === 200
							? {
									...g,
									isUserLoggedIn: true,
									userToken: pR.access_token,
									userRefreshToken: pR.refresh_token,
									userEmail: pR.email,
							  }
							: { ...g, isUserLoggedIn: false, userToken: '', userRefreshToken: '', userEmail: '' }
					)
					if (callback) callback(r, pR)
				}
			),
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
		isUserLoggedIn: false,
		userToken: '',
		userRefreshToken: undefined,
		userEmail: '',
		logIn: logIn,
		logOut: logOut,
	})

	// Handle session auth
	useEffect(() => {
		if (globals.userRefreshToken !== undefined) {
			if (globals.userRefreshToken === '') sessionStorage.removeItem('shortlived-auth')
			else sessionStorage.setItem('shortlived-auth', globals.userRefreshToken)
		}
	}, [globals.userRefreshToken])

	// Attempt to authenticate user automatically
	useEffect(() => {
		if (!globals.isUserLoggedIn) {
			const token = sessionStorage.getItem('shortlived-auth')
			if (token && globals.userRefreshToken !== '')
				refreshToken(token, (r, pR) => r.status !== 200 && logInFromCookie())
			else logInFromCookie()
		}
	}, [globals.isUserLoggedIn, globals.userRefreshToken, cookie, logInFromCookie, refreshToken])

	// Automatic token refresh
	useEffect(() => {
		let intervalId
		if (!isBlank(globals.userRefreshToken) && globals.isUserLoggedIn)
			intervalId = setInterval(() => refreshToken(globals.userRefreshToken), 600000) // Runs every 10 min because token expires after 15 min
		return () => clearInterval(intervalId)
	}, [globals.userRefreshToken, globals.isUserLoggedIn, refreshToken])

	return <AppContext.Provider value={globals}>{props.children}</AppContext.Provider>
}
