import { lazy, Suspense, useContext } from 'react'
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom'

import React from 'react'
import { AuthContext } from './component/auth/AuthContext'
import Login from './component/auth/Login'
import Register from './component/auth/Register'
import Film from './component/film/Film'
import Sidebar from './component/sidebar/Sidebar'

const LazyFavorites = lazy(() => import('./component/favorites/Favorites'))

const AppRoutes = () => {
	const { user } = useContext(AuthContext)
	return (
		<Router>
			<Sidebar />
			<Routes>
				{
					<Route
						path='/api/login'
						element={user ? <Navigate to='/api/films' /> : <Login />}
					/>
				}
				<Route
					path='/api/register'
					element={user ? <Navigate to='/api/films' /> : <Register />}
				/>

				<Route path='/api/films' element={<Film />} />
				<Route
					path='/api/favorites'
					element={
						<Suspense fallback={<div>Loading...</div>}>
							{user ? <LazyFavorites /> : <Navigate to='/api/login' />}
						</Suspense>
					}
				/>
				<Route path='*' element={<Navigate to='/api/films' replace />} />
			</Routes>
		</Router>
	)
}

export default AppRoutes
