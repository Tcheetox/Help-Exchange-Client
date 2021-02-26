import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import MaterialIcon from '@material-ui/icons/Widgets'
import ImmaterialIcon from '@material-ui/icons/ThumbUp'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import PublicIcon from '@material-ui/icons/Public'
import HourglassIcon from '@material-ui/icons/HourglassFull'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

export default function Badge({ type, tooltip }) {
	const icon = () => {
		switch (type) {
			case 'material':
				return <MaterialIcon />
			case 'immaterial':
				return <ImmaterialIcon />
			case 'visible':
				return <VisibilityIcon />
			case 'not-visible':
				return <VisibilityOffIcon />
			case 'cancelled':
				return <CancelIcon />
			case 'pending':
				return <HourglassIcon />
			case 'published':
				return <PublicIcon />
			case 'fulfilled':
				return <CheckCircleIcon />
			default:
				return null
		}
	}
	return (
		<div className={`badge ${type}`}>
			<OverlayTrigger placement='top' overlay={<Tooltip id={`BadgeTooltip-${type}`}>{tooltip}</Tooltip>}>
				<div>{icon()}</div>
			</OverlayTrigger>
		</div>
	)
}
