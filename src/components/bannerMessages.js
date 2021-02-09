import { Link } from 'react-router-dom'

export const AutomaticMessage = (text = null, timestamp = new Date().getTime()) => {
	return [text ? text : 'An unexpected error has occured, please try again later.', 'danger', 5000, timestamp]
}

export const WelcomeBack = (email, completed) => {
	const message = (
		<span>
			Welcome back <span className='bold'>{email}</span>!{' '}
			{!completed ? (
				<>
					Don't forget to{' '}
					<Link to='/users/account' className='bold'>
						complete your profile
					</Link>{' '}
					before using our services.
				</>
			) : (
				''
			)}
		</span>
	)
	return completed ? [message, 'success', 4000] : [message, 'success', 7000]
}

export const InvalidCredentials = () => [`Invalid username and/or password.`, 'danger', 5000]

export const SuccessCredentialsChanged = () => [
	`Credentials have been successfully changed.`,
	'success',
	5000,
]

export const ProfileIncomplete = () => [
	<span>
		You must{' '}
		<Link to='/users/account' className='bold'>
			complete your profile
		</Link>{' '}
		to access this service.
	</span>,
	'warning',
	5000,
]

export const NotAuthenticated = () => [
	<span>
		You must be authenticated to view this page. Don't have an account yet?{' '}
		<Link to='/users/signup' className='bold'>
			Sign up
		</Link>
		!
	</span>,
	'warning',
	5000,
]

export const GoodBye = () => [`See you soon!`, 'success', 4000]
