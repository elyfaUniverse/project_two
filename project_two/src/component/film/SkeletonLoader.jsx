// components/SkeletonLoader.jsx
import React from 'react'
import styles from './Film.module.css'

export const SkeletonLoader = () => {
	return (
		<div className={styles.content}>
			<div className={styles.wrapper}>
				{[...Array(6)].map((_, index) => (
					<div key={index} className={styles.skeletonCard}>
						<div className={styles.skeletonImage}></div>
						<div className={styles.skeletonText}></div>
					</div>
				))}
			</div>
		</div>
	)
}
