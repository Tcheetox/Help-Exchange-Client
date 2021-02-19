import React from 'react'

import MaterialIcon from '@material-ui/icons/Widgets'
import ImmaterialIcon from '@material-ui/icons/ThumbUp'

import { ReactComponent as MaterialPin } from '../media/icons/materialPin.svg'
import { ReactComponent as ImmaterialPin } from '../media/icons/immaterialPin.svg'

export default function Temp() {
	return (
		<div className='TEMP'>
			<div>
				<MaterialPin />
			</div>
			<div>
				<ImmaterialPin />
			</div>
		</div>
	)
}
