import React, { useState, useEffect, useContext, useRef } from 'react'

import Legend from './Legend'
import { AppData } from '../../AppData'
import { AppContext } from '../../AppContext'
import GoogleMapReact from 'google-map-react'
import { MarkerMemo } from './Marker'
import { UserMarkerMemo } from './UserMarker'
import Settings from './Settings'
import { logError } from '../../utilities'
import publicIP from 'react-native-public-ip'

// https://github.com/google-map-react/google-map-react/blob/HEAD/API.md
// https://developers.google.com/maps/documentation/javascript/controls

export default function GoogleMap({ forcedCenter }) {
  const { userProfile } = useContext(AppContext)
  const { helpRequests, refreshHelpRequests } = useContext(AppData)
  const [center, setCenter] = useState(
    forcedCenter
      ? { lat: parseFloat(forcedCenter.split(';')[0]), lng: parseFloat(forcedCenter.split(';')[1]) }
      : { lat: 46.2044, lng: 6.1432 }
  )
  const [mapType, setMapType] = useState('roadmap')
  const [fullScreen, setFullScreen] = useState(null)
  const userProfileRef = useRef()
  userProfileRef.current = userProfile
  const mapContainerRef = useRef()

  // Trigger refresh of help requests (filtered from the backend by status: published)
  useEffect(() => {
    refreshHelpRequests()
  }, [refreshHelpRequests])

  const hasGeolocationPermission = () => {
    try {
      navigator.permissions
        .query({
          name: 'geolocation',
        })
        .then(perm => {
          return perm.state === 'granted' ? true : false
        })
    } catch (error) {
      logError(error)
      return false
    }
  }

  // Automatically center map: use profile info (1) otherwise check if the browser shares the info (2), fallback to ip geolocation (3), default center set to Geneva (0)
  useEffect(() => {
    if (!forcedCenter) {
      if (userProfile && userProfile.lat && userProfile.lng) {
        setCenter({ lat: userProfile.lat, lng: userProfile.lng })
      } else if (hasGeolocationPermission()) {
        navigator.geolocation.getCurrentPosition(pos => {
          if (!userProfileRef.current || !userProfileRef.current.lat || !userProfileRef.current.lng)
            setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        })
      } else {
        try {
          publicIP().then(ip =>
            fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IP_GEOLOCATION_KEY}&ip=${ip}`)
              .then(resp => resp.json())
              .then(pos => {
                if (!userProfileRef.current || !userProfileRef.current.lat || !userProfileRef.current.lng)
                  setCenter({ lat: parseFloat(pos.latitude), lng: parseFloat(pos.longitude) })
              })
          )
        } catch (error) {
          logError(error)
        }
      }
    } else setCenter({ lat: parseFloat(forcedCenter.split(';')[0]), lng: parseFloat(forcedCenter.split(';')[1]) })
  }, [userProfile, forcedCenter])

  // Trigger fullscreen mode
  useEffect(() => {
    if (mapContainerRef.current && fullScreen !== null) {
      try {
        if (!document.fullscreenElement) mapContainerRef.current.requestFullscreen()
        else document.exitFullscreen()
      } catch (error) {
        logError(error)
      }
    }
  }, [fullScreen])

  return (
    <div className='map' ref={mapContainerRef}>
      <Settings setCenter={setCenter} mapType={mapType} setMapType={setMapType} fullScreen={fullScreen} setFullScreen={setFullScreen} />
      <Legend />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
        center={center}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          mapTypeId: mapType,
          clickableIcons: false,
        }}
        zoomControl={false}
        defaultZoom={13}
      >
        <UserMarkerMemo lat={center.lat} lng={center.lng} />
        {helpRequests.length ? helpRequests.map((h, i) => <MarkerMemo key={i} lat={h.lat} lng={h.lng} helpRequest={h} />) : null}
      </GoogleMapReact>
    </div>
  )
}
