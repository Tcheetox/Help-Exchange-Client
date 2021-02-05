import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import './styles/animation.css'

import { Switch, Route } from 'react-router-dom'

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

// TODO: 'request' folder -> nasty
// TODO: all the imports above -> nasty
// TODO: debug when no valid address is found!

export default function App() {
	return (
		<>
			<div className='fullscreen'>
				<Header />
				<Banner />
				<Switch>
					<Route path='/' component={Home} exact />
					<Route path='/about' component={Map} exact />
					<Route path='/faq' component={Faq} exact />
					<Route path='/users/signup' component={Signup} exact />
					<Route path='/users/login' component={Login} exact />
					<Route path='/users/edit' component={Profile} exact />
					<Route path='/users/dashboard' component={Dashboard} exact />
					<Route path='/users/messenger' component={Messenger} exact />
					<Route component={Error} />
				</Switch>
			</div>
			<Footer />
		</>
	)
}
