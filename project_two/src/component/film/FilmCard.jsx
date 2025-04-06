import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../axiosClient'
import styles from './FilmCard.module.css'

const FilmCard = ({ film, toggleFavorite, isAuthenticated }) => {
	const { id, imageUrl, text, aggregateRating, canal_1 } = film
	const [isFavorite, setIsFavorite] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)

	useEffect(() => {
		const checkFavoriteStatus = async () => {
			if (!isAuthenticated) return

			try {
				const response = await axiosClient.get(`/films/${id}/favorite`)
				setIsFavorite(response.data.isFavorite)
			} catch (err) {
				console.error('Check favorite error:', err)
			}
		}

		checkFavoriteStatus()
	}, [id, isAuthenticated])

	const handleToggleFavorite = async e => {
		e.preventDefault()
		if (isLoading || !isAuthenticated) return

		setIsLoading(true)
		try {
			const newFavoriteStatus = await toggleFavorite(id)
			setIsFavorite(newFavoriteStatus)
		} catch (err) {
			console.error('Failed to toggle favorite:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={styles.item}>
			<Link to={`/films/${id}`}>
				<div className={styles.imageContainer}>
					{!imageLoaded && <div className={styles.imagePlaceholder} />}
					<img
						src={imageUrl}
						alt={text}
						style={{ display: 'none' }}
						onLoad={() => setImageLoaded(true)}
					/>
					{imageLoaded && (
						<div
							className={styles.image}
							style={{ backgroundImage: `url(${imageUrl})` }}
						/>
					)}
					<div className={styles.info}>
						<span className={styles.rating}>{aggregateRating}</span>
						<span className={styles.channel}>{canal_1}</span>
					</div>
				</div>
			</Link>
			<div className={styles.footer}>
				<h3>{text}</h3>
				{isAuthenticated && (
					<button
						onClick={handleToggleFavorite}
						className={`${styles.favoriteButton} ${
							isFavorite ? styles.active : ''
						}`}
						disabled={isLoading}
					>
						{isFavorite ? '★' : '☆'}
					</button>
				)}
			</div>
		</div>
	)
}

export default FilmCard
