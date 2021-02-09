import React, { useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'

import { AppContext } from './AppContext'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { ProfileIncomplete, NotAuthenticated } from './components/bannerMessages'

export default function ProtectedRoute({
	path,
	component,
	exact,
	authenticated = false,
	profileCompleted = false,
}) {
	const { isUserLoggedIn, userProfileCompleted, toggleBanner } = useContext(AppContext)

	// Banner must be triggered by UE absolutely!
	// TODO: must be able to discard banner!!!
	useEffect(() => {
		if (authenticated && !isUserLoggedIn) toggleBanner(NotAuthenticated())
		else if (authenticated && profileCompleted && !userProfileCompleted) {
			toggleBanner(ProfileIncomplete())
		}
	}, [authenticated, profileCompleted, isUserLoggedIn, userProfileCompleted, toggleBanner])

	return (
		<Route
			path={path}
			component={
				authenticated && !isUserLoggedIn
					? Login
					: authenticated && profileCompleted && !userProfileCompleted
					? Profile
					: component
			}
			exact={exact}
		/>
	)
}
