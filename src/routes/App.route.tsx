import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardContainer from '@/containers/dashboard/Dashboard.container'
import ScrollToTop from '@/components/scroll-to-top/ScrollToTop.component'
import Redirect from '@/components/redirect/Redirect.component'

export const AppRouter = () => (
	<BrowserRouter>
		<Routes>
			<Route path={'/'} element={<DashboardContainer />}>
				{/* <Route index element={<HomeContainer />} />

				<Route path={'/guides'} element={<GuidesContainer />} />
				<Route path={'/guides/:id'} element={<GuideContainer />} />

				<Route path={'/profile'} element={<AccountContainer />} />

				<Route path={'/authenticate'} element={<AuthenticateContainer />} /> */}
			</Route>

			<Route path="*" element={<Redirect to="/" />} />
		</Routes>
		<ScrollToTop />
	</BrowserRouter>
)
