import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import type { RootState } from '@/redux/types/Root.type'
import { useAppSelector } from '@/hooks/useAppSelector'
import { requestHomeMostLiked, requestHomeRecent } from '@/redux/actions/Guide.action'
import { requestCategoryData } from '@/redux/actions/Category.action'
import Home from '@/components/dashboard/home/Home.component'
import { Utils } from '@/utils/Utils'

function HomeContainer() {
	const dispatch = useDispatch()

	const { homeMostLiked, homeMostLikedLoading, homeRecent, homeRecentLoading } = useAppSelector(
		(state: RootState) => state.guide
	)
	const { categoryData, categoryDataLoading } = useAppSelector(
		(state: RootState) => state.system.category
	)

	useEffect(() => {
		dispatch(requestHomeMostLiked(6))
		dispatch(requestHomeRecent(6))

		if (categoryData.length === 0 && !categoryDataLoading) {
			dispatch(requestCategoryData())
		}
	}, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

	const subcategoryMeta = useMemo(() => Utils.buildSubcategoryMeta(categoryData), [categoryData])

	return (
		<Home
			mostLikedGuides={homeMostLiked}
			mostLikedLoading={homeMostLikedLoading}
			recentGuides={homeRecent}
			recentLoading={homeRecentLoading}
			subcategoryMeta={subcategoryMeta}
		/>
	)
}

export default HomeContainer
