import { Search as SearchIcon, SlidersHorizontal, X, Filter as FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import CategoryPicker from '@/components/category-picker/CategoryPicker.component'
import GuideCard from '@/components/guide-card/GuideCard.component'
import type { GuideItem, GuideSort } from '@/redux/types/Guide.type'
import type { SubCategoryItem } from '@/redux/types/Category.type'

const SORTS: { key: GuideSort; label: string }[] = [
	{ key: 'recent', label: 'Recent' },
	{ key: 'liked', label: 'Most liked' },
]

interface GuidesProps {
	guides: GuideItem[]
	search: string
	sort: GuideSort
	subcategoryId: string | null
	activeSubcategory: SubCategoryItem | null
	activeCategoryColor: string | null
	mobileFilterOpen: boolean
	isLoading: boolean
	onSearchChange: (value: string) => void
	onSortChange: (sort: GuideSort) => void
	onSelectSubcategory: (subcategoryId: string | null) => void
	onMobileFilterOpenChange: (open: boolean) => void
	subcategoryMeta: Map<string, { name: string; color: string }>
}

function Guides({
	guides,
	search,
	sort,
	subcategoryId,
	activeSubcategory,
	activeCategoryColor,
	mobileFilterOpen,
	isLoading,
	onSearchChange,
	onSortChange,
	onSelectSubcategory,
	onMobileFilterOpenChange,
	subcategoryMeta,
}: GuidesProps) {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<div className="mb-6">
				<h1 className="font-display text-3xl font-bold">Browse guides</h1>
				<p className="mt-1 text-muted-foreground">
					Find base builds, systems, and tips from the community.
				</p>
			</div>

			<div className="flex flex-col gap-8 lg:flex-row">
				<aside className="hidden w-60 shrink-0 lg:block">
					<div className="sticky top-20">
						<h2 className="mb-3 px-1 text-sm font-semibold">Categories</h2>
						<CategoryPicker
							activeSubcategoryId={subcategoryId}
							onSelectSubcategory={onSelectSubcategory}
						/>
					</div>
				</aside>

				<div className="min-w-0 flex-1">
					<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={e => onSearchChange(e.target.value)}
								placeholder="Search guides..."
								className="p-2.5 pl-9"
							/>
						</div>

						<Sheet open={mobileFilterOpen} onOpenChange={onMobileFilterOpenChange}>
							<SheetTrigger asChild>
								<Button variant="outline" size="sm" className="lg:hidden">
									<FilterIcon className="size-4" />
									{activeSubcategory ? activeSubcategory.name : 'Categories'}
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-80 overflow-y-auto">
								<SheetHeader className="mb-4">
									<SheetTitle>Categories</SheetTitle>
								</SheetHeader>
								<CategoryPicker
									activeSubcategoryId={subcategoryId}
									onSelectSubcategory={id => {
										onSelectSubcategory(id)
										onMobileFilterOpenChange(false)
									}}
								/>
							</SheetContent>
						</Sheet>

						<div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
							<SlidersHorizontal className="ml-1 size-4 text-muted-foreground" />
							{SORTS.map(s => (
								<button
									key={s.key}
									onClick={() => onSortChange(s.key)}
									className={cn(
										'cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-colors',
										sort === s.key
											? 'bg-primary text-primary-foreground'
											: 'text-muted-foreground hover:text-foreground'
									)}
								>
									{s.label}
								</button>
							))}
						</div>
					</div>

					{activeSubcategory && (
						<div className="mb-5 flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Showing</span>
							<button
								onClick={() => onSelectSubcategory(null)}
								className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium"
								style={{
									color: activeCategoryColor ?? undefined,
									borderColor: `color-mix(in oklab, ${activeCategoryColor} 45%, transparent)`,
									backgroundColor: `color-mix(in oklab, ${activeCategoryColor} 10%, transparent)`,
								}}
							>
								{activeSubcategory.name}
								<X className="size-3.5" />
							</button>
						</div>
					)}

					{isLoading ? (
						<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className="h-72 animate-pulse rounded-xl border border-border bg-card"
								/>
							))}
						</div>
					) : guides.length > 0 ? (
						<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							{guides.map(guide => {
								const meta = guide.subcategoryId
									? subcategoryMeta.get(guide.subcategoryId)
									: undefined
								return (
									<GuideCard
										key={guide.id}
										guide={guide}
										subcategoryName={meta?.name}
										subcategoryColor={meta?.color}
									/>
								)
							})}
						</div>
					) : (
						<div className="rounded-xl border border-dashed border-border bg-card/40 p-16 text-center">
							<p className="text-muted-foreground">
								No guides match your search yet.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Guides
