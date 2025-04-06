import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],

	// Настройки для обработки css/SASS
	css: {
		preprocessorOptions: {
			css: {
				additionalData: `@import "./src/styles/variables.css";`,
			},
		},
	},

	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/api/, ''),
				// Добавляем необходимые заголовки
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
					'Access-Control-Allow-Headers': 'Content-Type,Authorization',
				},
			},
		},
	},

	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		manifest: true,
		// Оптимизация для CSS
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				assetFileNames: 'assets/[name].[hash].[ext]',
			},
		},
	},
})
