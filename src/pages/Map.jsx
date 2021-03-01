import React from 'react'

import GoogleMap from '../components/map/GoogleMap'
import Counter from '../components/Counter'

export default function Map({ match }) {
	return (
		<>
			<Counter />
			<GoogleMap
				forcedCenter={
					match.params && 'center' in match.params && match.params.center.includes(';')
						? match.params.center
						: null
				}
			/>
		</>
	)
}
