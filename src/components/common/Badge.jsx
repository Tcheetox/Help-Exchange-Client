import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import MaterialIcon from '@mui/icons-material/Widgets'
import ImmaterialIcon from '@mui/icons-material/ThumbUp'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PublicIcon from '@mui/icons-material/Public'
import HourglassIcon from '@mui/icons-material/HourglassFull'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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
