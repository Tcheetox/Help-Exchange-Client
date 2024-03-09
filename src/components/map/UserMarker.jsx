import React from 'react'

import UserLocationIcon from '@mui/icons-material/PersonPinCircle'

export const UserMarkerMemo = React.memo(UserMarker)
export default function UserMarker() {
  return <UserLocationIcon className='user-marker' />
}
