import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'

import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const Sidebar = () => {
	const { user, logout } = useContext(AuthContext)
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/api/login')
	}
	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	return (
		<>
			<div
				className={`${styles.burger} ${isOpen ? styles.open : ''}`}
				onClick={toggleMenu}
			>
				<div className={styles.line}></div>
				<div className={styles.line}></div>
				<div className={styles.line}></div>
			</div>
			<div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
				<div>
					{user ? (
						<div>
							<span className={styles.wrapName}>
								<p>Hello,</p>

								<p className={styles.name}> {user.name || user.email}</p>
							</span>
							<button onClick={handleLogout}>LogOut</button>
						</div>
					) : (
						<div className={styles.wrapper}>
							<Link to='/api/register' onClick={() => setIsOpen(false)}>
								<button>SignUp</button>
							</Link>
							<Link to='/api/login' onClick={() => setIsOpen(false)}>
								<button>Login</button>
							</Link>
						</div>
					)}
				</div>

				<ul>
					<Link to='/api/films' onClick={() => setIsOpen(false)}>
						<li>
							<h2>Film</h2>
						</li>
					</Link>

					<Link to='/api/favorites' onClick={() => setIsOpen(false)}>
						<li>
							<h2>Favorites</h2>
						</li>
					</Link>
				</ul>
			</div>
		</>
	)
}

export default Sidebar
