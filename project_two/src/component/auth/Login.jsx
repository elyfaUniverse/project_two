import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import styles from './Login.module.css'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const { login } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		try {
			await login(email, password)
			navigate('/')
		} catch (err) {
			setError(err.response?.data?.error || 'Login failed')
		}
	}

	return (
		<div className={styles.container}>
			<h2>Login</h2>
			{error && <div className={styles.error}>{error}</div>}
			<form onSubmit={handleSubmit} className={styles.form}>
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
				<button type='submit'>Login</button>
			</form>
		</div>
	)
}

export default Login
