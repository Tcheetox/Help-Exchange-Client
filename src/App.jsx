import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import './styles/animation.css'

import { Switch, Route } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import Header from './components/Header'
import Banner from './components/Banner'
import Footer from './components/Footer'

import Home from './pages/Home'
import Map from './pages/Map'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Messenger from './pages/Messenger'
import Faq from './pages/Faq'

// TODO: all the imports above -> nasty

export default function App() {
	return (
		<>
			<div className='fullscreen'>
				<Header />
				<Banner />
				<Switch>
					<Route path='/' component={Home} exact={true} />
					<Route path='/map' component={Map} exact />
					<Route path='/faq' component={Faq} exact />

					<Route path='/users/signup' component={Signup} exact />
					<Route path='/users/login' component={Login} exact />
					<ProtectedRoute path='/users/account' component={Profile} exact={true} authenticated={true} />
					<ProtectedRoute
						path='/users/account/:section'
						component={Profile}
						exact={false}
						authenticated={true}
					/>

					<ProtectedRoute
						path='/users/dashboard'
						component={Dashboard}
						exact={true}
						authenticated={true}
						profileCompleted={true}
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

					<ProtectedRoute path='/users/messenger' component={Messenger} exact={true} authenticated={true} />
					<ProtectedRoute path='/users/messenger/:id' component={Messenger} authenticated={true} />

					<Route component={Error} />
				</Switch>
			</div>
			<Footer />
		</>
	)
}
