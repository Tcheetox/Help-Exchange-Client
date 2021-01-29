import React, { useContext, useState, useEffect } from 'react'

import { AppContext } from '../../AppContext'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import LoadingButton from '../decorations/LoadingButton'

import PinIcon from '@material-ui/icons/PinDrop'
import OwnerIcon from '@material-ui/icons/RecordVoiceOver'
import PersonIcon from '@material-ui/icons/Person'
import ChatIcon from '@material-ui/icons/Chat'
import MaterialIcon from '@material-ui/icons/Widgets'
import ImmaterialIcon from '@material-ui/icons/ThumbUp'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import PublicIcon from '@material-ui/icons/Public'
import HourglassIcon from '@material-ui/icons/HourglassFull'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

export default function HelpRequest({
	onRequestUpdated,
	eventKey,
	data: { id, title, description, status, help_type, users, created_at, pending_at, address },
}) {
	const { fetchRequest, isUserLoggedIn, userId, toggleBanner } = useContext(AppContext)
	const [role, setRole] = useState('')

	useEffect(
		() =>
			setRole(() => {
				const user = users.find(u => u.id === userId)
				return user ? user.user_type : ''
			}),
		[users, userId]
	)

	const handleClick = e =>
		isUserLoggedIn &&
		fetchRequest(
			'PUT',
			{ subaction: e.target.name },
			`help_requests/${id}`,
			(r, pR) => r.status === 200 && onRequestUpdated(pR)
		)

	return (
		<Card className={`help-request ${role}`}>
			<Accordion.Toggle as={Card.Header} eventKey={eventKey}>
				<div className='info'>
					<div className='title'>{title}</div>
					<div className='date'>Posted on {created_at}</div>
				</div>
				<div className='badges'>
					{help_type === 'material' ? <MaterialIcon /> : <ImmaterialIcon />}
					{status === 'published' ? <VisibilityIcon /> : <VisibilityOffIcon />}
					{status === 'cancelled' ? (
						<CancelIcon />
					) : status === 'fulfilled' ? (
						<CheckCircleIcon />
					) : status === 'pending' ? (
						<HourglassIcon />
					) : (
						<PublicIcon />
					)}
				</div>
			</Accordion.Toggle>
			<Accordion.Collapse eventKey={eventKey}>
				<Card.Body>
					<div className='actions'>
						{role === 'owner' &&
						(status === 'cancelled' ||
							(status === 'pending' &&
								new Date(pending_at).setDate(new Date(pending_at).getDate() + 1) < new Date())) ? (
							<LoadingButton variant='info' name='republish' onClick={handleClick}>
								Republish
							</LoadingButton>
						) : null}
						{role === 'owner' && status !== 'cancelled' && status !== 'fulfilled' ? (
							<LoadingButton variant='danger' name='cancel' onClick={handleClick}>
								Cancel
							</LoadingButton>
						) : null}
						{role === '' ? (
							<LoadingButton variant='warning' name='subscribe' onClick={handleClick}>
								Subscribe
							</LoadingButton>
						) : null}
						{role === 'respondent' ? (
							<LoadingButton variant='secondary' name='unsubscribe' onClick={handleClick}>
								Unsubscribe
							</LoadingButton>
						) : null}
						{role.length > 0 && status !== 'fulfilled' ? (
							<LoadingButton variant='success' name='markasfulfilled' onClick={handleClick}>
								Mark as fulfilled
							</LoadingButton>
						) : null}
					</div>
					<div className='description'>{description}</div>
					<div className='location'>
						<PinIcon /> {address}
					</div>
					<div className='people'>
						{users.map((x, k) => (
							<OverlayTrigger
								key={k}
								placement='bottom'
								overlay={
									<Tooltip>
										{x.first_name} {x.last_name}
										{(role === 'owner' && x.user_type !== 'owner') ||
										(role === 'respondent' && x.user_type === 'owner') ? (
											<ChatIcon />
										) : null}
									</Tooltip>
								}>
								{x.user_type === 'owner' ? (
									<OwnerIcon className={`owner ${x.id === userId ? 'current' : ''}`} />
								) : (
									<PersonIcon className={`respondent ${x.id === userId ? 'current' : ''}`} />
								)}
							</OverlayTrigger>
						))}
					</div>
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	)
}
