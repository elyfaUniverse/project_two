import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import styles from './Register.module.css'

const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [error, setError] = useState('')
	const { register } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		try {
			await register(email, password, name)
			navigate('/')
		} catch (err) {
			setError(err.response?.data?.error || 'Registration failed')
		}
	}

	return (
		<div className={styles.container}>
			<h2>Register</h2>
			{error && <div className={styles.error}>{error}</div>}
			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					type='text'
					placeholder='Name'
					value={name}
					onChange={e => setName(e.target.value)}
					required
				/>
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
				<button type='submit'>Register</button>
			</form>
		</div>
	)
}

export default Register
