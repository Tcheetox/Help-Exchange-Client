import React, { useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'

import { AppContext } from './AppContext'
import { Profile, Login } from './pages/'

export default function ProtectedRoute({
	path,
	component,
	exact = false,
	authenticated = false,
	profileCompleted = false,
}) {
	const { userLoggedIn, userProfileCompleted, triggerBanner } = useContext(AppContext)

	useEffect(() => {
		if (authenticated && !userLoggedIn) triggerBanner('authentication_required')
		else if (authenticated && profileCompleted && !userProfileCompleted) triggerBanner('incomplete_profile')
	}, [authenticated, profileCompleted, userLoggedIn, userProfileCompleted, triggerBanner])

	return (
		<Route
			path={path}
			component={
				authenticated && !userLoggedIn
					? Login
					: authenticated && profileCompleted && !userProfileCompleted
					? Profile
					: component
			}
			exact={exact}
		/>
	)
}
