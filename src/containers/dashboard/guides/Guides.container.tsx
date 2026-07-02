import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { RootState } from '@/redux/types/Root.type'
import { requestGuideList } from '@/redux/actions/Guide.action'
import type { GuideSort } from '@/redux/types/Guide.type'
import Guides from '@/components/dashboard/guides/Guides.component'
import { useAppSelector } from '@/hooks/useAppSelector'

function GuidesContainer() {
	const dispatch = useDispatch()

	const { guideList, guideListLoading } = useAppSelector((state: RootState) => state.guide)
	const { categoryData } = useAppSelector((state: RootState) => state.system.category)

	const [search, setSearch] = useState('')
	const [sort, setSort] = useState<GuideSort>('recent')
	const [subcategoryId, setSubcategoryId] = useState<string | null>(null)
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

	useEffect(() => {
		dispatch(
			requestGuideList({ subcategoryId: subcategoryId ?? undefined, status: 'published' })
		)
	}, [dispatch, subcategoryId])

	const { activeSubcategory, activeCategoryColor } = useMemo(() => {
		if (!subcategoryId) return { activeSubcategory: null, activeCategoryColor: null }

		for (const category of categoryData) {
			const match = category.subcategories.find(
				subcategory => subcategory.id === subcategoryId
			)

			if (match) return { activeSubcategory: match, activeCategoryColor: category.color }
		}

		return { activeSubcategory: null, activeCategoryColor: null }
	}, [categoryData, subcategoryId])

	const filteredGuides = useMemo(() => {
		const term = search.trim().toLowerCase()

		const filtered = term
			? guideList.filter(
					guide =>
						guide.title.toLowerCase().includes(term) ||
						guide.summary.toLowerCase().includes(term)
				)
			: guideList

		if (sort === 'liked') {
			return [...filtered].sort((a, b) => b.likeCount - a.likeCount)
		}

		return filtered
	}, [guideList, search, sort])

	const subcategoryMeta = useMemo(() => {
		const map = new Map<string, { name: string; color: string }>()
		for (const category of categoryData) {
			for (const sub of category.subcategories) {
				map.set(sub.id, { name: sub.name, color: category.color })
			}
		}
		return map
	}, [categoryData])

	return (
		<Guides
			search={search}
			onSearchChange={setSearch}
			sort={sort}
			onSortChange={setSort}
			subcategoryId={subcategoryId}
			onSelectSubcategory={setSubcategoryId}
			activeSubcategory={activeSubcategory}
			activeCategoryColor={activeCategoryColor}
			mobileFilterOpen={mobileFilterOpen}
			onMobileFilterOpenChange={setMobileFilterOpen}
			isLoading={guideListLoading}
			guides={filteredGuides}
			subcategoryMeta={subcategoryMeta}
		/>
	)
}

export default GuidesContainer
