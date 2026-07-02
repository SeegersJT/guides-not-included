import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cn } from '@/lib/utils'
import { LayoutGrid, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import type { RootState } from '@/redux/types/Root.type'
import { requestCategoryData } from '@/redux/actions/Category.action'
import { useAppSelector } from '@/hooks/useAppSelector'

interface CategoryPickerProps {
	activeSubcategoryId: string | null
	onSelectSubcategory: (subcategoryId: string | null) => void
}

function CategoryPicker({ activeSubcategoryId, onSelectSubcategory }: CategoryPickerProps) {
	const dispatch = useDispatch()

	const { categoryData, categoryDataLoading } = useAppSelector(
		(state: RootState) => state.system.category
	)

	const [filter, setFilter] = useState('')
	const [openValue, setOpenValue] = useState<string>('')

	useEffect(() => {
		if (categoryData.length === 0 && !categoryDataLoading) {
			dispatch(requestCategoryData())
		}
	}, [categoryData.length, categoryDataLoading, dispatch])

	// Default: first category open once data arrives (only if nothing open yet)
	useEffect(() => {
		if (categoryData.length > 0 && !openValue) {
			setOpenValue(categoryData[0].id)
		}
	}, [categoryData, openValue])

	// When the active subcategory changes (e.g. selected from elsewhere, or
	// cleared), make sure its parent group is the one that's open.
	useEffect(() => {
		if (!activeSubcategoryId) return

		const parent = categoryData.find(category =>
			category.subcategories.some(sub => sub.id === activeSubcategoryId)
		)

		if (parent) setOpenValue(parent.id)
	}, [activeSubcategoryId, categoryData])

	const groups = useMemo(() => {
		const term = filter.trim().toLowerCase()

		if (!term) {
			return [...categoryData].sort((a, b) => Number(a.order) - Number(b.order))
		}

		return categoryData
			.map(category => {
				const groupMatches = category.name.toLowerCase().includes(term)
				const matchingSubs = category.subcategories.filter(sub =>
					sub.name.toLowerCase().includes(term)
				)

				if (!groupMatches && matchingSubs.length === 0) return null

				return {
					...category,
					subcategories: groupMatches ? category.subcategories : matchingSubs,
				}
			})
			.filter((category): category is (typeof categoryData)[number] => category !== null)
			.sort((a, b) => Number(a.order) - Number(b.order))
	}, [categoryData, filter])

	// While actively filtering, open the first matching group so results
	// are visible without a click. Restore normal single-select behavior
	// once the filter is cleared (handled by the effects above).
	useEffect(() => {
		if (filter.trim() && groups.length > 0) setOpenValue(groups[0].id)
	}, [filter, groups])

	return (
		<div className="flex flex-col gap-3">
			<button
				onClick={() => onSelectSubcategory(null)}
				className={cn(
					'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
					activeSubcategoryId === null
						? 'border-primary/50 bg-primary/15 text-foreground'
						: 'border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
				)}
			>
				<LayoutGrid className="size-4" />
				All guides
			</button>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={filter}
					onChange={e => setFilter(e.target.value)}
					placeholder="Filter categories..."
					className="h-9 pl-9 text-sm"
				/>
			</div>

			{categoryDataLoading && categoryData.length === 0 ? (
				<p className="px-1 py-2 text-sm text-muted-foreground">Loading categories...</p>
			) : groups.length === 0 ? (
				<p className="px-1 py-2 text-sm text-muted-foreground">No categories match.</p>
			) : (
				<Accordion
					type="single"
					collapsible
					value={openValue}
					onValueChange={setOpenValue}
					className="w-full"
				>
					{groups.map(group => (
						<AccordionItem key={group.id} value={group.id} className="border-border">
							<AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:no-underline">
								{group.name}
							</AccordionTrigger>
							<AccordionContent className="pb-2">
								<div className="flex flex-col gap-0.5">
									{group.subcategories.map(sub => {
										const isActive = activeSubcategoryId === sub.id
										return (
											<button
												key={sub.id}
												onClick={() => onSelectSubcategory(sub.id)}
												className={cn(
													'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
													isActive
														? 'font-medium text-foreground'
														: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
												)}
												style={
													isActive
														? {
																backgroundColor: `color-mix(in oklab, ${group.color} 16%, transparent)`,
															}
														: undefined
												}
											>
												<span
													className="size-2.5 shrink-0 rounded-full"
													style={{ backgroundColor: group.color }}
												/>
												{sub.name}
											</button>
										)
									})}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			)}
		</div>
	)
}

export default CategoryPicker
