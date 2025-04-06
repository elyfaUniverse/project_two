import React, { useContext, useEffect, useState } from 'react'
import axiosClient from '../../axiosClient'
import { AuthContext } from '../auth/AuthContext'
import FilmCard from '../film/FilmCard'
import styles from './Favorites.module.css'

const Favorites = () => {
	const { user } = useContext(AuthContext)
	const [favorites, setFavorites] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchFavorites = async () => {
			if (!user) return

			try {
				const [favoritesRes, filmsRes] = await Promise.all([
					axiosClient.get('/favorites'),
					axiosClient.get('/films'),
				])

				const favoriteFilms = filmsRes.data.filter(film =>
					favoritesRes.data.some(fav => fav.filmId === film.id)
				)
				setFavorites(favoriteFilms)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchFavorites()
	}, [user])

	const handleRemoveFavorite = async filmId => {
		try {
			await axiosClient.delete(`/favorites/${filmId}`)
			setFavorites(prev => prev.filter(film => film.id !== filmId))
		} catch (err) {
			console.error('Failed to remove favorite:', err)
			setError('Failed to remove from favorites')
		}
	}

	if (!user)
		return <div className={styles.message}>Please login to view favorites</div>
	if (loading) return <div className={styles.message}>Loading...</div>
	if (error) return <div className={styles.error}>Error: {error}</div>

	return (
		<div className={styles.container}>
			<h2>Your Favorites</h2>
			{favorites.length === 0 ? (
				<p>No favorite films yet</p>
			) : (
				<div className={styles.grid}>
					{favorites.map(film => (
						<div key={film.id} className={styles.favoriteItem}>
							<FilmCard film={film} isAuthenticated={true} />
							<button
								onClick={() => handleRemoveFavorite(film.id)}
								className={styles.removeButton}
							>
								Remove
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Favorites
