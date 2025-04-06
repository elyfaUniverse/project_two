import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import styles from './FilmDetails.module.css'

const fetchFilmDetails = async id => {
	const response = await axios.get(`http://localhost:3000/api/film/${id}`)
	return response.data
	// Вместо axios.get() можно использовать fetch() или другой HTTP-клиент для получения детальных информации о фильме.
	// Возвращаем данные в виде объекта.
	// Если вам нужно получить отдельные данные из ответа, например, название фильма, можно использовать response.data.title.
}

const FilmDetails = () => {
	const { id } = useParams()
	const {
		data: film,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['film', id],
		queryFn: () => fetchFilmDetails(id),
	})
	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error fetching film details</div>

	return (
		<div className={styles.wrapper}>
			<div className={styles.content}>
				<div className={styles.item}>
					<h2>{film.text}</h2>
					<p>{film.about}</p>
					<p>Rating: {film.aggregateRating}</p>
					<p>Voted: {film.voteCount}</p>
					<p>Year of release: {film.year}</p>
					<p>Channel: {film.canal_1}</p>
					<p>Channel: {film.canal_2}</p>
					<p>Avaible: {film.available}</p>
					<button> {film.button}</button>
				</div>

				<div
					style={{
						backgroundImage: `url(${film.imageUrl})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
						width: '400px',
						height: '650px',
						padding: '20px',
						borderRadius: '10px',
					}}
				></div>
			</div>
		</div>
	)
}

export default FilmDetails
