import React from 'react'
import { AuthProvider } from './component/auth/AuthProvider'

import AppRoutes from './AppRoutes'


function App() {
	return (
		<>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
		</>
	)
}

export default App
