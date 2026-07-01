import type React from 'react'
import Link from '../link/Link.component'

interface GuideRowProps {
	title: string
	icon: React.ReactNode
	emptyText?: string
}

function GuideRow({ title, icon, emptyText }: GuideRowProps) {
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-display text-2xl font-bold">
					{icon} {title}
				</h2>
				<Link
					to="/guides"
					variant="none"
					className="text-sm font-medium text-primary hover:underline"
				>
					View all
				</Link>
			</div>
			{/* {query.isLoading ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-72 animate-pulse rounded-xl border border-border bg-card"
						/>
					))}
				</div>
			) : query.data && query.data.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{query.data.map(guide => (
						<GuideCard key={guide.id} guide={guide} />
					))}
				</div>
			) : (
				<p className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-muted-foreground">
					{emptyText ?? 'Nothing here yet.'}
				</p>
			)} */}

			<p className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-muted-foreground">
				{emptyText ?? 'Nothing here yet.'}
			</p>
		</section>
	)
}

export default GuideRow
