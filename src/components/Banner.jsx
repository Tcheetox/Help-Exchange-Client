import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../AppContext'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

export default function Banner() {
  const { banner, triggerBanner, userLoggedIn, userProfileCompleted } = useContext(AppContext)
  const [bannerSpec, setBannerSpec] = useState({ message: '', type: '', duration: 0 })
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    if (banner && (banner.length || Object.keys(banner).length > 0)) {
      let newBanner = { message: '', type: '', duration: 0 }
      const bannerName = typeof banner === 'string' ? banner.toLowerCase() : banner.name.toLowerCase()
      switch (bannerName) {
        case 'welcome':
          newBanner = {
            message: (
              <span>
                Welcome back <span className='bold'>{banner.email}</span>!{' '}
                {!banner.profileCompleted ? (
                  <>
                    Don't forget to <Link to='/users/account/information'>complete your profile</Link> before using our services.
                  </>
                ) : (
                  ''
                )}
              </span>
            ),
            type: 'success',
            duration: 4000,
          }
          break

        case 'unexpected_error':
          newBanner = {
            message: 'An unexpected error has occured, please try again later.',
            type: 'danger',
            duration: 5000,
          }
          break

        case 'google_sign_in_error':
          newBanner = {
            message: (
              <span>
                Google sign-in is only available for dedicated testers. Please contact our{' '}
                <a href='mailto:fishforhelp@thekecha.com?subject=Tester request'>support</a>.
              </span>
            ),
            type: 'warning',
            duration: 4500,
          }
          break

        case 'invalid_credentials':
          newBanner = {
            message: 'Invalid username and/or password.',
            type: 'danger',
            duration: 5000,
          }
          break

        case 'changed_credentials':
          newBanner = {
            message: 'Credentials have been changed successfully.',
            type: 'success',
            duration: 5000,
          }
          break

        case 'request_created':
          newBanner = {
            message: (
              <span>
                Your request has been published and is visible on the <Link to='/map'>map</Link>.
              </span>
            ),
            type: 'success',
            duration: 4000,
          }
          break

        case 'request_cancelled':
          newBanner = {
            message: (
              <span>
                Your request has been cancelled and is no longer visible on the <Link to='/map'>map</Link>.
              </span>
            ),
            type: 'warning',
            duration: 4000,
          }
          break

        case 'request_subscribed':
          newBanner = {
            message: (
              <span>
                Yeah! You subscribed to a help request, it will now appear on your <Link to='/users/dashboard'>dashboard</Link>.
              </span>
            ),
            type: 'success',
            duration: 4000,
          }
          break

        case 'profile_updated':
          newBanner = {
            message: 'Profile information successfully updated.',
            type: 'success',
            duration: 5000,
          }
          break

        case 'account_verified':
          newBanner = {
            message: 'Your account has been verified. You can log in normally.',
            type: 'success',
            duration: 5000,
          }
          break

        case 'forgot_password':
          newBanner = {
            message: 'A link to reset your password has been sent. Please check your inbox.',
            type: 'warning',
            duration: 5000,
          }
          break

        case 'send_confirmation':
          newBanner = {
            message: 'A confirmation email has been sent. Please check your inbox.',
            type: 'warning',
            duration: 5000,
          }
          break

        case 'incomplete_profile':
          newBanner = {
            message: (
              <span>
                You must <Link to='/users/account/information'>complete your profile</Link> to access this service.
              </span>
            ),
            type: 'warning',
            duration: 5000,
          }
          break

        case 'authentication_required':
          newBanner = {
            message: (
              <span>
                You must be authenticated to view this page. Don't have an account yet? <Link to='/users/signup'>Sign up</Link>!
              </span>
            ),
            type: 'warning',
            duration: 5000,
          }
          break

        case 'goodbye':
          newBanner = { message: 'See you soon!', type: 'success', duration: 4000 }
          break
        default:
      }
      setBannerSpec(newBanner)
    }
  }, [banner])

  // Handle automatic hideout
  useEffect(() => {
    let timeout
    if (bannerSpec.duration > 0) {
      setDisplay(true)
      timeout = setTimeout(() => setDisplay(false), bannerSpec.duration)
    }
    return () => clearTimeout(timeout)
  }, [bannerSpec])

  // Smart banner automatic discard
  useEffect(() => {
    if (display && ((userLoggedIn && banner === 'authentication_required') || (userProfileCompleted && banner === 'incomplete_profile')))
      setDisplay(false)
  }, [display, userLoggedIn, userProfileCompleted, banner])

  // Reset banner
  useEffect(() => {
    !display && triggerBanner(null)
  }, [triggerBanner, display])

  return display ? (
    <Container className='banner'>
      <Alert variant={bannerSpec.type} onClose={() => setDisplay(false)} dismissible>
        {bannerSpec.message}
      </Alert>
    </Container>
  ) : null
}
