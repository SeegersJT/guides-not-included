import type React from 'react'
import Link from '../link/Link.component'
import GuideCard from '@/components/guide-card/GuideCard.component'
import type { GuideItem } from '@/redux/types/Guide.type'

interface GuideRowProps {
	title: string
	icon: React.ReactNode
	emptyText?: string
	guides: GuideItem[]
	isLoading: boolean
	subcategoryMeta: Map<string, { name: string; color: string }>
}

function GuideRow({ title, icon, emptyText, guides, isLoading, subcategoryMeta }: GuideRowProps) {
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-display text-2xl font-bold">
					{icon} {title}
				</h2>
				<Link
					to="/guides"
					variant="outline"
					className="text-sm font-medium text-primary hover:underline"
				>
					View all
				</Link>
			</div>
			{isLoading ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-72 animate-pulse rounded-xl border border-border bg-card"
						/>
					))}
				</div>
			) : guides.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
				<p className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-muted-foreground">
					{emptyText ?? 'Nothing here yet.'}
				</p>
			)}
		</section>
	)
}

export default GuideRow
