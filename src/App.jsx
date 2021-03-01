import React from 'react'
import { Switch, Route } from 'react-router-dom'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import './styles/animation.css'
import './styles/mobile.css'

import ProtectedRoute from './ProtectedRoute'
import Header from './components/Header'
import Banner from './components/Banner'
import Footer from './components/Footer'
import LeftMenu from './components/LeftMenu'
import { Home, Map, Signup, Login, Profile, Dashboard, Messenger, Faq, Troubleshoot } from './pages/'

export default function App() {
	return (
		<>
			<div className='fullscreen'>
				<Header />
				<div className='fullscreen-no-header'>
					<Banner />
					<LeftMenu />
					<Switch>
						<Route path='/' component={Home} exact />

						<Route path='/map' component={Map} exact />
						<Route path='/map/:center' component={Map} exact />

						<Route path='/faq' component={Faq} exact />

						<Route path='/users/signup' component={Signup} exact />

						<Route path='/users/login' component={Login} exact />
						<Route path='/users/login/:token' component={Login} exact />

						<ProtectedRoute path='/users/account' component={Profile} authenticated={true} exact={true} />
						<ProtectedRoute path='/users/account/:section' component={Profile} authenticated={true} />

						<Route path='/users/troubleshoot/:action' component={Troubleshoot} exact />
						<Route path='/users/troubleshoot/:action/:token' component={Troubleshoot} exact />

						<ProtectedRoute
							path='/users/dashboard'
							component={Dashboard}
							authenticated={true}
							profileCompleted={true}
							exact={true}
						/>
						<ProtectedRoute
							path='/users/dashboard/:section/:id'
							component={Dashboard}
							authenticated={true}
							profileCompleted={true}
						/>
						<ProtectedRoute
							path='/users/dashboard/:section'
							component={Dashboard}
							authenticated={true}
							profileCompleted={true}
						/>

						<ProtectedRoute path='/users/messenger' component={Messenger} authenticated={true} exact={true} />
						<ProtectedRoute path='/users/messenger/:id' component={Messenger} authenticated={true} />

						<Route component={Error} />
					</Switch>
				</div>
			</div>
			<Footer />
		</>
	)
}
