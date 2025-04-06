import React from 'react'
import amazon from '../../public/icons/amazon.png'
import apple from '../../public/icons/apple.png'

import hulu from '../../public/icons/hulu.png'
import max from '../../public/icons/max.png'
import netflix from '../../public/icons/netflix.png'
import prime from '../../public/icons/prime.png'

export const renderIcon = channel => {
	switch (channel) {
		case 'Netflix':
			return (
				<div
					style={{
						backgroundImage: `url(${netflix})`,
						borderRadius: '5px',
						backgroundColor: 'black',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						padding: '15px 20px',
					}}
				></div>
			)
		case 'Apple TV+':
			return (
				<div
					style={{
						backgroundImage: `url(${apple})`,
						borderRadius: '5px',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						padding: '25px 25px',
					}}
				></div>
			)
		case 'Max':
			return (
				<div
					style={{
						backgroundImage: `url(${max})`,
						borderRadius: '5px',
						backgroundColor: 'black',
						backgroundSize: 'cover',
						backgroundPosition: 'center',

						backgroundRepeat: 'no-repeat',
						padding: '20px 20px',
					}}
				></div>
			)
		case 'Hulu':
			return (
				<div
					style={{
						backgroundImage: `url(${hulu})`,
						borderRadius: '5px',
						backgroundColor: 'white',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						padding: '15px 20px',
					}}
				></div>
			)
		case 'Prime Video':
			return (
				<div
					style={{
						backgroundImage: `url(${prime})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						padding: '20px 20px',
					}}
				></div>
			)
		case 'Amazon':
			return (
				<div
					style={{
						backgroundImage: `url(${amazon})`,
						backgroundColor: 'white',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						padding: '20px 20px',
					}}
				></div>
			)
		default:
			return null
	}
}
