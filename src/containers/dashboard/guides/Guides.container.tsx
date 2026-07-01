import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { RootState } from '@/redux/types/Root.type'
import { requestGuideData } from '@/redux/actions/Guide.action'
import type { GuideSort } from '@/redux/types/Guide.type'
import Guides from '@/components/dashboard/guides/Guides.component'
import { useAppSelector } from '@/hooks/useAppSelector'

function GuidesContainer() {
	const dispatch = useDispatch()

	const { guideData, guideDataLoading } = useAppSelector((state: RootState) => state.guide)
	const { categoryData } = useAppSelector((state: RootState) => state.system.category)

	const [search, setSearch] = useState('')
	const [sort, setSort] = useState<GuideSort>('recent')
	const [subcategoryId, setSubcategoryId] = useState<string | null>(null)
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

	useEffect(() => {
		dispatch(requestGuideData({ subcategoryId, sort }))
	}, [dispatch, subcategoryId, sort])

	const activeSubcategory = useMemo(() => {
		if (!subcategoryId) return null

		for (const category of categoryData) {
			const match = category.subcategories.find(
				subcategories => subcategories.id === subcategoryId
			)

			if (match) return match
		}

		return null
	}, [categoryData, subcategoryId])

	const filteredGuides = useMemo(() => {
		const term = search.trim().toLowerCase()

		if (!term) return guideData

		return guideData.filter(
			guide =>
				guide.title.toLowerCase().includes(term) ||
				guide.description.toLowerCase().includes(term)
		)
	}, [guideData, search])

	return (
		<Guides
			search={search}
			onSearchChange={setSearch}
			sort={sort}
			onSortChange={setSort}
			subcategoryId={subcategoryId}
			onSelectSubcategory={setSubcategoryId}
			activeSubcategory={activeSubcategory}
			mobileFilterOpen={mobileFilterOpen}
			onMobileFilterOpenChange={setMobileFilterOpen}
			isLoading={guideDataLoading}
			guides={filteredGuides}
		/>
	)
}

export default GuidesContainer
