import React from 'react'

import CloseIcon from '@mui/icons-material/Close'

export default function CloseButton({ onClick }) {
  const handleClick = e => {
    e.stopPropagation()
    onClick()
  }

  return (
    <div className='close' onClick={handleClick}>
      <CloseIcon />
    </div>
  )
}
