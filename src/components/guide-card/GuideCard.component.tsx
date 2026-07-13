import type { GuideItem } from '@/redux/types/Guide.type'
import { LikeButton } from '@/components/like-button/LikeButton.component'
import Link from '@/components/link/Link.component'

interface GuideCardProps {
	guide: GuideItem
	subcategoryName?: string
	subcategoryColor?: string
}

function GuideCard({ guide, subcategoryName, subcategoryColor }: GuideCardProps) {
	return (
		<Link to={`/guides/${guide.id}`} type="card">
			<div className="relative aspect-[16/10] overflow-hidden bg-secondary">
				{guide.coverImage && (
					<img
						src={guide.coverImage}
						alt=""
						className="size-full object-cover transition-transform group-hover:scale-105"
					/>
				)}
				{subcategoryName && (
					<span
						className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium"
						style={{
							color: subcategoryColor,
							backgroundColor: `color-mix(in oklab, ${subcategoryColor} 20%, black)`,
						}}
					>
						{subcategoryName}
					</span>
				)}
			</div>

			<div className="p-4">
				<h3 className="font-display text-base font-bold leading-tight">{guide.title}</h3>
				<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{guide.summary}</p>

				<div className="mt-4 flex items-center justify-between">
					<span className="text-sm text-muted-foreground">
						by <span className="font-medium text-foreground">{guide.authorName}</span>
					</span>
					<LikeButton guideId={guide.id} likeCount={guide.likeCount ?? 0} />
				</div>
			</div>
		</Link>
	)
}

export default GuideCard
