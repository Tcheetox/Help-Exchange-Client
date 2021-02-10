import React from 'react'

import UserLocationIcon from '@material-ui/icons/PersonPinCircle'

export const UserMarkerMemo = React.memo(UserMarker)
export default function UserMarker() {
	return <UserLocationIcon className='user-marker' />
}
