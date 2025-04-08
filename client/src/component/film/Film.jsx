import React, { useCallback, useContext, useEffect, useState } from 'react'
import axiosClient from '../../axiosClient'
import { AuthContext } from '../auth/AuthContext'
import styles from './Film.module.css'
import FilmCard from './FilmCard'

const Film = () => {
	const { user } = useContext(AuthContext)
	const [films, setFilms] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchFilms = async () => {
			try {
				const response = await axiosClient.get('/api/films')
				setFilms(response.data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		fetchFilms()
	}, [])

	const toggleFavorite = useCallback(
		async filmId => {
			if (!user) return alert('Please login to manage favorites')

			try {
				const response = await axiosClient.post(`/api/films/${filmId}/favorite`)
				return response.data.isFavorite
			} catch (err) {
				console.error('Favorite toggle error:', err)
				throw err
			}
		},
		[user]
	)

	if (loading) return <div className={styles.loading}>Loading...</div>
	if (error) return <div className={styles.error}>Error: {error}</div>

	return (
		<div className={styles.content}>
			<div className={styles.wrapper}>
				{films.map(film => (
					<FilmCard
						key={film.id}
						film={film}
						toggleFavorite={toggleFavorite}
						isAuthenticated={!!user}
					/>
				))}
			</div>
		</div>
	)
}

export default Film
