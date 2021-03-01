import React from 'react'

import { ReactComponent as MaterialPin } from '../../media/icons/materialPin.svg'
import { ReactComponent as ImmaterialPin } from '../../media/icons/immaterialPin.svg'

export default function Legend() {
	return (
		<div className='legend'>
			<div className='material'>
				<MaterialPin />
				Material
			</div>
			<div className='immaterial'>
				<ImmaterialPin />
				One-time
				<br />
				help
			</div>
		</div>
	)
}
