import React, { useState } from 'react'

import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import MaterialIcon from '@material-ui/icons/Widgets'
import ImmaterialIcon from '@material-ui/icons/ThumbUp'
import LocationIcon from '@material-ui/icons/LocationOn'

export default function Marker({
	helpRequest: { address, created_at, description, help_count, help_type, title },
}) {
	const [preventClose, setPreventClose] = useState(undefined)
	const popover = (
		<Popover
			className='popover'
			onMouseEnter={() => setPreventClose(true)}
			onMouseLeave={() => setPreventClose(undefined)}>
			<Popover.Title>
				{help_type === 'material' ? <MaterialIcon /> : <ImmaterialIcon />}
				{title}
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
