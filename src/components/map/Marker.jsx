import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../../AppContext'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import MaterialIcon from '@material-ui/icons/Widgets'
import ImmaterialIcon from '@material-ui/icons/ThumbUp'
import LocationIcon from '@material-ui/icons/LocationOn'
import SubscribeIcon from '@material-ui/icons/PostAdd'
import ManageIcon from '@material-ui/icons/Launch'

export const MarkerMemo = React.memo(Marker)
export default function Marker({
	helpRequest: { id, address, created_at, description, help_count, help_type, title, managed },
}) {
	const { isUserLoggedIn, fetchRequest } = useContext(AppContext)
	const [preventClose, setPreventClose] = useState(undefined)

	const popover = (
		<Popover
			className='popover'
			onMouseEnter={() => setPreventClose(true)}
			onMouseLeave={() => setPreventClose(undefined)}>
			<Popover.Title>
				{help_type === 'material' ? <MaterialIcon /> : <ImmaterialIcon />}
				{title}
				{managed ? (
					<Link to={`users/dashboard/overview/${id}`}>
						<ManageIcon />
					</Link>
				) : (
					<SubscribeIcon
						onClick={() => isUserLoggedIn && fetchRequest('PUT', null, `help_requests/${id}/subscribe`)}
					/>
				)}
			</Popover.Title>
			<Popover.Content>{description}</Popover.Content>
		</Popover>
	)

	return (
		<div className='marker'>
			<OverlayTrigger
				placement='top'
				overlay={popover}
				trigger={['hover', 'focus', 'click']}
				show={preventClose}>
				<LocationIcon className={help_type} />
			</OverlayTrigger>
		</div>
	)
}
