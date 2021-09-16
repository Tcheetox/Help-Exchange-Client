import React from 'react'

import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export default function CircularProgress({ percent, title }) {
	return (
		<OverlayTrigger placement='left' overlay={<Tooltip id='CircularProgressTooltip'>{title}</Tooltip>}>
			<div className='circular-progress'>
				<div className={`progress ${percent >= 100 ? 'complete' : 'incomplete'}`}>
					<span className='progress-left'>
						<span
							className='progress-bar border-primary'
							style={{
								transform: `rotate(${percent > 50 ? (percent - 50) * 3.6 : 0}deg)`,
								transition: `all ${percent === 100 ? '0ms' : 'var(--default-transition-duration)'}`,
							}}></span>
					</span>
					<span className='progress-right'>
						<span
							className='progress-bar border-primary'
							style={{
								transform: `rotate(${percent > 0 && percent >= 50 ? 180 : percent * 3.6}deg)`,
								transition: `all ${percent === 100 ? '0ms' : 'var(--default-transition-duration)'}`,
							}}></span>
					</span>
					<div className='progress-value'>
						<div className='value h4 bold'>
							<div className='percentage'>%</div>
							{percent.toString().length > 3 ? percent.toString().substring(0, 2) : percent}
						</div>
					</div>
				</div>
			</div>
		</OverlayTrigger>
	)
}
