import Dashboard from '@/components/dashboard/Dashboard.component'
import HeaderContainer from './header/Header.container'
import FooterContainer from './footer/Footer.container'

function DashboardContainer() {
	return (
		<>
			<HeaderContainer />
			<Dashboard />
			<FooterContainer />
		</>
	)
}

export default DashboardContainer
