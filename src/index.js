import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './AppContext'
import { ActionCableProvider } from 'react-actioncable-provider' // TODO: move

//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<BrowserRouter>
		<ActionCableProvider url='ws://localhost:3000/api/v1/cable'>
			<AppContextProvider>
				<App />
			</AppContextProvider>
		</ActionCableProvider>
	</BrowserRouter>,
	document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
