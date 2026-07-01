import { ImageOff } from 'lucide-react'
import Link from '../link/Link.component'
import type { GuideItem } from '@/redux/types/Guide.type'
import CategoryBadge from '../category-badge/CategoryBadge.component'

interface GuideCardProps {
	guide: GuideItem
}

function GuideCard({ guide }: GuideCardProps) {
	return (
		<Link to={`/guides/${guide.id}`} type="card" variant="default">
			<div className="relative aspect-[16/9] overflow-hidden bg-secondary/50">
				{guide.cover_image_url ? (
					<img
						src={guide.cover_image_url}
						alt={guide.title}
						loading="lazy"
						className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex size-full items-center justify-center text-muted-foreground/40">
						<ImageOff className="size-8" />
					</div>
				)}
				<div className="absolute left-3 top-3">
					<CategoryBadge subCategoryId={guide.sub_category_id} />
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<h3 className="font-display text-lg font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary">
					{guide.title}
				</h3>
				{guide.summary && (
					<p className="text-sm text-muted-foreground line-clamp-2">{guide.summary}</p>
				)}
				<div className="mt-auto flex items-center justify-between pt-2">
					<span className="truncate text-xs text-muted-foreground">
						by{' '}
						<span className="font-medium text-foreground/80">
							{guide.author_username ?? 'Unknown'}
						</span>
					</span>
					{/* <LikeButton guideId={guide.id} initialCount={guide.likes_count} /> */}
				</div>
			</div>
		</Link>
	)
}

export default GuideCard
