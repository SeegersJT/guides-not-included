import { useAppSelector } from '@/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'

interface CategoryBadgeProps {
	subCategoryId: string
	className?: string
}

function CategoryBadge({ subCategoryId, className }: CategoryBadgeProps) {
	const { categoryData } = useAppSelector((state: RootState) => state.system.category)

	const subCategory = useMemo(
		() =>
			categoryData
				.flatMap(category => category.subcategories)
				.find(sub => sub.id === subCategoryId),
		[categoryData, subCategoryId]
	)

	const color = subCategory?.color ?? 'var(--color-muted-foreground)'

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm',
				className
			)}
			style={{
				color,
				borderColor: `color-mix(in oklab, ${color} 45%, transparent)`,
				backgroundColor: `color-mix(in oklab, ${color} 14%, oklch(0.18 0.018 248 / 0.7))`,
			}}
		>
			{subCategory?.name ?? subCategoryId}
		</span>
	)
}

export default CategoryBadge
