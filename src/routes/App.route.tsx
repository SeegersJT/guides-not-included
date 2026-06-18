import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardContainer from '@/containers/landing-page/Dashboard.container'
import ScrollToTop from '@/components/scroll-to-top/ScrollToTop.component'

export const AppRouter = () => (
	<BrowserRouter>
		<Routes>
			<Route path={'/'} element={<DashboardContainer />} />

			<Route path="*" element={<Navigate to={'/'} replace />} />
		</Routes>
		<ScrollToTop />
	</BrowserRouter>
)
