import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardContainer from '@/containers/dashboard/Dashboard.container'
import ScrollToTop from '@/components/scroll-to-top/ScrollToTop.component'
import NotFoundContainer from '@/containers/not-found/NotFound.container'
import HomeContainer from '@/containers/dashboard/home/Home.container'
import GuidesContainer from '@/containers/dashboard/guides/Guides.container'

export const AppRouter = () => (
	<BrowserRouter>
		<Routes>
			<Route path={'/'} element={<DashboardContainer />}>
				<Route index element={<HomeContainer />} />

				<Route path={'/guides'} element={<GuidesContainer />} />
				{/* <Route path={'/guides/:id'} element={<GuideContainer />} /> */}

				<Route index element={<CategoryContainer />} />

				{/* <Route path={'/admin'} element={<AdminContainer />}>
					<Route index element={<AuthenticationContainer />} />

					<Route index element={<ProfileContainer />} />
				</Route> */}
			</Route>

			<Route path="*" element={<NotFoundContainer />} />
		</Routes>
		<ScrollToTop />
	</BrowserRouter>
)
