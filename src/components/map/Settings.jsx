import React, { useState } from 'react'

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import SettingsIcon from '@mui/icons-material/Settings'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import CenterIcon from '@mui/icons-material/MyLocation'

export default function Settings({ setCenter, mapType, setMapType, fullScreen, setFullScreen }) {
  const [dropdown, setDropdown] = useState(false)

  return (
    <DropdownButton
      id='SettingsDropdown'
      className={`settings-dropdown ${fullScreen ? 'fullscreen' : ''}`}
      title={<SettingsIcon />}
      show={dropdown}
      onClick={() => setDropdown(!dropdown)}
      onMouseLeave={() => setDropdown(false)}
      onMouseEnter={() => setDropdown(true)}
    >
      <ToggleButtonGroup type='radio' name='maptypeid-options' onChange={v => setMapType(v)} defaultValue={mapType}>
        <ToggleButton value='roadmap'>Roadmap</ToggleButton>
        <ToggleButton value='hybrid'>Hybrid</ToggleButton>
        <ToggleButton value='satellite'>Satellite</ToggleButton>
        <ToggleButton value='terrain'>Terrain</ToggleButton>
      </ToggleButtonGroup>
      <Dropdown.Item
        onClick={() => navigator.geolocation.getCurrentPosition(pos => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }))}
      >
        Center <CenterIcon />
      </Dropdown.Item>
      <Dropdown.Item onClick={() => setFullScreen(!fullScreen)}>
        Fullscreen {window.fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Dropdown.Item>
    </DropdownButton>
  )
}
