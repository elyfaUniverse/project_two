import React, { useEffect, useState } from 'react'
import axiosClient from '../../axiosClient'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadUser = async () => {
			const token = localStorage.getItem('token')
			if (!token) {
				setLoading(false)
				return
			}

			try {
				const response = await axiosClient.get('/api/me')
				setUser(response.data)
			} catch (err) {
				console.error('Failed to load user:', err)
				localStorage.removeItem('token')
			} finally {
				setLoading(false)
			}
		}

		loadUser()
	}, [])

	const register = async (email, password, name) => {
		try {
			const response = await axiosClient.post('/api/register', {
				email,
				password,
				name,
			})
			localStorage.setItem('token', response.data.token)
			setUser({
				id: response.data.userId,
				email: response.data.email,
				name: response.data.name,
			})
			return response.data
		} catch (error) {
			console.error('Registration error:', error)
			throw error
		}
	}

	const login = async (email, password) => {
		try {
			const response = await axiosClient.post('/api/login', { email, password })
			localStorage.setItem('token', response.data.token)
			setUser({
				id: response.data.user.id,
				email: response.data.user.email,
				name: response.data.user.name,
			})
			return response.data
		} catch (error) {
			console.error('Login error:', error)
			throw error
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
	}

	if (loading) return <div>Loading...</div>

	return (
		<AuthContext.Provider value={{ user, register, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	)
}
