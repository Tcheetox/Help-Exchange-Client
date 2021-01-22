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
					<Link to='/users/edit' className='bold'>
						complete your profile
					</Link>{' '}
					before using our services.
				</>
			) : (
				''
			)}
		</span>
	)
	return completed ? [message, 'success', 3000] : [message, 'success', 6500]
}

export const InvalidCredentials = () => [`Invalid username and/or password.`, 'danger', 4000]

export const GoodBye = () => [`See you soon!`, 'success', 3000]
