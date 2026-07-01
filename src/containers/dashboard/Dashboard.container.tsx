import Dashboard from '@/components/dashboard/Dashboard.component'
import HeaderContainer from './header/Header.container'
import FooterContainer from './footer/Footer.container'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useEffect } from 'react'
import {
	requestAddCategory,
	requestAddSubcategory,
	requestCategoryData,
} from '@/redux/actions/Category.action'
import { useAppSelector } from '@/hooks/useAppSelector'
import type { RootState } from '@/redux/store'

function DashboardContainer() {
	const dispatch = useAppDispatch()

	const { categoryData } = useAppSelector((state: RootState) => state.system.category)

	useEffect(() => {
		const categoryPayload = {
			name: 'Test Category',
			icon: 'flask',
			order: 1,
			subcategories: [],
		}

		const subCategoryPayload = {
			name: 'Test Sub',
			color: '#ff0000',
			order: 1,
		}

		// dispatch(requestAddCategory(categoryPayload))
		// dispatch(requestAddSubcategory('Uypv6A5UyvWGBMqwzQPA', subCategoryPayload))
	}, [])

	useEffect(() => {
		dispatch(requestCategoryData())
	}, [categoryData])

	return (
		<>
			<HeaderContainer />
			<Dashboard />
			<FooterContainer />
		</>
	)
}

export default DashboardContainer
