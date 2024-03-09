import React, { useState, useEffect, useContext } from 'react'

import { geocode, reverseGeocode, titleize } from '../../utilities'
import Form from 'react-bootstrap/Form'
import { InputForm, LoadingButton } from '../common/'
import ExploreIcon from '@mui/icons-material/Explore'
import { AppContext } from '../../AppContext'

export default function CreateRequest() {
  const { fetchRequest, userLoggedIn, userProfile, triggerBanner } = useContext(AppContext)
  const [display, setDisplay] = useState(0)
  const [displayLocating, setDisplayLocating] = useState(0)
  const [data, setData] = useState({
    title: '',
    description: '',
    help_type: 'One-time help',
    address: '',
    lng: null,
    lat: null,
  })
  const [errors, setErrors] = useState({
    title: undefined,
    description: undefined,
    help_type: undefined,
    address: undefined,
  })

  useEffect(() => {
    userLoggedIn &&
      userProfile &&
      setData(d => {
        return {
          ...d,
          address: `${userProfile.address}, ${userProfile.post_code} ${userProfile.country}`,
          lng: userProfile.lng,
          lat: userProfile.lat,
        }
      })
  }, [fetchRequest, userLoggedIn, userProfile])

  const onChange = e => {
    if (e.target.name === 'address') setData({ ...data, address: e.target.value, lat: null, lng: null })
    else setData({ ...data, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const onSubmit = e => {
    e.preventDefault()
    const _errors = { ...errors }
    Object.keys(_errors).forEach(k => {
      if (data[k].length > 0) _errors[k] = ''
      else _errors[k] = `${titleize(k)} cannot be left empty`
    })
    setErrors(_errors)
    // Submit form if no errors
    if (Object.values(_errors).filter(x => x === '').length === Object.keys(errors).length && userLoggedIn) {
      setDisplay(1)
      if (!data.lng || !data.lat)
        geocode(data.address, ({ lat, lng }) => {
          if (lat && lng) fetchRequest('POST', { ...data, lng: lng, lat: lat }, 'help_requests', fetchCallback)
          else {
            setErrors(er => ({ ...er, address: 'Invalid address' }))
            setDisplay(0)
          }
        })
      else fetchRequest('POST', data, 'help_requests', fetchCallback)
    }
  }

  const fetchCallback = r => {
    if (r.status === 201) {
      triggerBanner('request_created')
      setDisplay(2)
    } else {
      setDisplay(0)
      triggerBanner('unexpected_error')
    }
  }

  const acquireLocation = () => {
    setDisplayLocating(1)
    navigator.geolocation.getCurrentPosition(
      pos => {
        reverseGeocode({ lat: pos.coords.latitude, lng: pos.coords.longitude }, addr =>
          setData({ ...data, address: addr, lat: pos.coords.latitude, lng: pos.coords.longitude })
        )
        setDisplayLocating(0)
      },
      () => setDisplayLocating(0)
    )
  }

  return (
    <Form onSubmit={onSubmit} className='create-request'>
      <InputForm
        label='Title'
        name='title'
        placeholder='Request title'
        value={data.title}
        error={errors.title}
        onChange={onChange}
        display={display}
      />
      <InputForm
        label='Request type'
        name='help_type'
        type='select'
        value={data.help_type}
        onChange={onChange}
        error={errors.help_type}
        display={display}
      >
        <option>One-time help</option>
        <option>Material</option>
      </InputForm>
      <Form.Row>
        <InputForm
          label='Location'
          name='address'
          placeholder='Complete address'
          value={data.address}
          error={errors.address}
          onChange={onChange}
          display={display}
        />
        <LoadingButton onClick={acquireLocation} className='fancy-blue location' display={display !== 0 ? display : displayLocating}>
          <ExploreIcon />
        </LoadingButton>
      </Form.Row>
      <InputForm
        label='Description'
        name='description'
        placeholder='Define your help request'
        type='textarea'
        rows={5}
        value={data.description}
        error={errors.description}
        onChange={onChange}
        display={display}
        maxChars={300}
        text={data.description.length > 0 ? `${300 - data.description.length} characters remaining` : 'Maximum 300 characters'}
      />
      <LoadingButton className='plain-blue' type='submit' display={display}>
        Submit
      </LoadingButton>
    </Form>
  )
}
