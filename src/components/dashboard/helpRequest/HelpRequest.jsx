import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { AppContext } from '../../../AppContext'
import { AppData } from '../../../AppData'
import dateFormat from 'dateformat'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import PinIcon from '@material-ui/icons/PinDrop'
import OwnerIcon from '@material-ui/icons/RecordVoiceOver'
import PersonIcon from '@material-ui/icons/Person'
import ChatIcon from '@material-ui/icons/Chat'
import { Badge } from '../../common'
import { titleize } from '../../../utilities'

export default function HelpRequest({
	eventKey,
	active,
	data: { id, title, description, status, help_type, users, created_at, pending_at, address },
}) {
	const { fetchRequest, userLoggedIn, userId, triggerBanner } = useContext(AppContext)
	const { conversations } = useContext(AppData)
	const [role, setRole] = useState('')
	const history = useHistory()

	useEffect(
		() =>
			setRole(() => {
				const user = users.find(u => u.id === userId)
				return user ? user.user_type : ''
			}),
		[users, userId]
	)

	const isChattable = user_type => (role === 'owner' && user_type !== 'owner') || (role === 'respondent' && user_type === 'owner')

	const handleClick = e =>
		userLoggedIn &&
		fetchRequest(
			'PUT',
			null,
			`help_requests/${id}/${e.target.name}`,
			(r, pR) => e.target.name === 'cancel' && r.status === 200 && triggerBanner('request_cancelled')
		)

	const handleConversation = t => {
		if ((role === 'owner' && t.user_type !== 'owner') || (role === 'respondent' && t.user_type === 'owner')) {
			const convo = conversations.find(c => c.help_request_id === id && c.target_user_id === t.id)
			if (userLoggedIn && !convo)
				fetchRequest(
					'POST',
					{ help_request_id: id, target_user_id: t.id },
					'conversations',
					(r, pR) => r.status === 201 && history.push(`/users/messenger/${pR.id}`)
				)
			else if (convo) history.push(`/users/messenger/${convo.id}`)
			else history.push('/users/messenger')
		}
	}

	const getIconClass = x => `owner ${x.id === userId ? 'current' : ''} ${isChattable(x.user_type) ? 'chattable' : ''}`

	return (
		<Card className={`help-request ${role} ${active ? 'active' : 'inactive'}`}>
			<Accordion.Toggle as={Card.Header} eventKey={eventKey}>
				<div className='info'>
					<div className='title'>{title}</div>
					<div className='date'>Created {dateFormat(created_at, 'mmm dd yyyy')}</div>
				</div>
				<div className='badges'>
					<Badge type={help_type} tooltip={help_type === 'material' ? 'Material' : 'One-time help'} />
					{status === 'published' ? <Badge type='visible' tooltip='Visible' /> : <Badge type='not-visible' tooltip='Not visible' />}
					<Badge type={status} tooltip={titleize(status)} />
				</div>
			</Accordion.Toggle>
			<Accordion.Collapse eventKey={eventKey}>
				<Card.Body>
					<div className='description'>{description}</div>
					<hr />
					<div className='flex-content'>
						<div>
							<div className='location'>
								<PinIcon />{' '}
								<a href={`https://www.google.com/maps/dir//${address}`} target='_blank' rel='noreferrer'>
									{address}
								</a>
							</div>
							<div className='people'>
								{users
									.sort((a, b) => a.user_type > b.user_type)
									.map((x, k) => (
										<OverlayTrigger
											key={k}
											placement='bottom'
											overlay={
												<Tooltip id={`ChattableTooltip-${k}`} className='chattable-tooltip'>
													{x.first_name} {x.last_name}
													{isChattable(x.user_type) ? <ChatIcon /> : null}
												</Tooltip>
											}>
											{x.user_type === 'owner' ? (
												<OwnerIcon className={`owner ${getIconClass()}`} onClick={() => handleConversation(x)} />
											) : (
												<PersonIcon className={`respondent ${getIconClass()}`} onClick={() => handleConversation(x)} />
											)}
										</OverlayTrigger>
									))}
							</div>
						</div>

						<div className='actions'>
							{role === 'owner' &&
							(status === 'cancelled' ||
								(status === 'pending' && new Date(pending_at).setDate(new Date(pending_at).getDate() + 1) < new Date())) ? (
								<Button className='fancy-green' name='republish' onClick={handleClick}>
									Republish
								</Button>
							) : null}
							{role === 'owner' && status !== 'cancelled' && status !== 'fulfilled' ? (
								<Button className='plain-red' name='cancel' onClick={handleClick}>
									Cancel
								</Button>
							) : null}
							{role === 'respondent' && status !== 'cancelled' && status !== 'fulfilled' ? (
								<Button className='fancy-red' name='unsubscribe' onClick={handleClick}>
									Unsubscribe
								</Button>
							) : null}
							{role.length > 0 && status !== 'fulfilled' && status !== 'cancelled' ? (
								<Button className='plain-green' name='markasfulfilled' onClick={handleClick}>
									Mark as fulfilled
								</Button>
							) : null}
						</div>
					</div>
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	)
}
