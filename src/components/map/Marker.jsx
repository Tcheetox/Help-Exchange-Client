import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { AppContext } from '../../AppContext'
import { AppData } from '../../AppData'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import SubscribeIcon from '@material-ui/icons/PostAdd'
import ManageIcon from '@material-ui/icons/FormatListBulleted'
import { ReactComponent as MaterialPin } from '../../media/icons/materialPin.svg'
import { ReactComponent as ImmaterialPin } from '../../media/icons/immaterialPin.svg'

export const MarkerMemo = React.memo(Marker)
export default function Marker({ helpRequest: { id, description, help_type, title } }) {
	const history = useHistory()
	const { userLoggedIn, userProfileCompleted, fetchRequest, triggerBanner } = useContext(AppContext)
	const { userHelpRequests } = useContext(AppData)
	const [preventClose, setPreventClose] = useState(undefined)

	const popover = (
		<Popover
			className={`map-popover ${help_type}`}
			onMouseEnter={() => setPreventClose(true)}
			onMouseLeave={() => setPreventClose(undefined)}>
			<Popover.Title>
				<div className='request-title'>{title}</div>

				<div className='icon-action'>
					{userHelpRequests.length && userHelpRequests.find(u => u.id === id) ? (
						<Link to={`/users/dashboard/overview/${id}`}>
							<ManageIcon className='manage' />
						</Link>
					) : (
						<SubscribeIcon
							className='subscribe'
							onClick={() => {
								if (userLoggedIn && userProfileCompleted)
									fetchRequest(
										'PUT',
										null,
										`help_requests/${id}/subscribe`,
										(r, pR) => r.status === 200 && triggerBanner('request_subscribed')
									)
								else history.push('/users/dashboard/overview')
							}}
						/>
					)}
				</div>
			</Popover.Title>
			<Popover.Content>{description}</Popover.Content>
		</Popover>
	)

	return (
		<div className='marker'>
			<OverlayTrigger placement='top' overlay={popover} trigger={['hover', 'focus', 'click']} show={preventClose}>
				<div className='icon-wrapper'>
					{help_type === 'material' ? <MaterialPin className={help_type} /> : <ImmaterialPin className={help_type} />}
				</div>
			</OverlayTrigger>
		</div>
	)
}
