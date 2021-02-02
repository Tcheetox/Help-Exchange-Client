import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import './styles/animation.css'

import { Switch, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import Header from './components/Header'
import Banner from './components/Banner'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Messenger from './pages/Messenger'

// TODO: -wrapper -> nasty
// TODO: 'request' folder -> nasty
// TODO: all the imports above -> nasty
// TODO: debug when no valid address is found!

export default function App() {
	return (
		<>
			<div className='fullscreen'>
				<Header />
				<Banner />
				<Container className='core-wrapper'>
					<Switch>
						<Route path='/' component={Home} exact />
						<Route path='/about' component={About} exact />
						<Route path='/users/signup' component={Signup} exact />
						<Route path='/users/login' component={Login} exact />
						<Route path='/users/edit' component={Profile} exact />
						<Route path='/users/dashboard' component={Dashboard} exact />
						<Route path='/users/messenger' component={Messenger} exact />
						<Route component={Error} />
					</Switch>
				</Container>
			</div>
			<Footer />
		</>
	)
}
