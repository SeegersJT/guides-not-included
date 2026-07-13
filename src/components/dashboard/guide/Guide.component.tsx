import { CalendarDays, ImageOff, Link2, ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import Link from '@/components/link/Link.component'
import { Button } from '@/components/ui/button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import CategoryBadge from '@/components/category-badge/CategoryBadge.component'
import { LikeButton } from '@/components/like-button/LikeButton.component'
import GuideCard from '@/components/guide-card/GuideCard.component'
import type { GuideItem } from '@/redux/types/Guide.type'
import GuideBlocksView from '@/components/guide-blocks-view/GuideBlockView.component'
import CommentsContainer from '@/containers/comments/Comments.container'

interface GuideProps {
	guide: GuideItem
	isOwner: boolean
	linkedGuides: GuideItem[]
	deleting: boolean
	onDelete: () => void
}

function Guide({ guide, isOwner, linkedGuides, deleting, onDelete }: GuideProps) {
	return (
		<article className="mx-auto max-w-3xl px-4 py-8">
			<Link
				to="/guides"
				type="text"
				variant="secondary"
				className="mb-6 inline-flex items-center gap-1.5 text-sm"
			>
				<ArrowLeft className="size-4" /> Back to guides
			</Link>

			<div className="mb-3 flex items-center justify-between gap-3">
				{guide.subcategoryId ? (
					<CategoryBadge subCategoryId={guide.subcategoryId} />
				) : (
					<span />
				)}

				{isOwner && (
					<div className="flex items-center gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to={`/edit/${guide.id}`}>
								<Pencil className="size-4" /> Edit
							</Link>
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="text-destructive"
									disabled={deleting}
								>
									<Trash2 className="size-4" /> Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete this guide?</AlertDialogTitle>
									<AlertDialogDescription>
										This permanently removes the guide and its content. This
										can't be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</div>

			<h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
				{guide.title}
			</h1>
			{guide.summary && <p className="mt-3 text-lg text-muted-foreground">{guide.summary}</p>}

			<div className="mt-5 flex flex-wrap items-center gap-4">
				<span className="text-sm text-muted-foreground">
					by <span className="font-medium text-foreground">{guide.authorName}</span>
				</span>
				<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
					<CalendarDays className="size-4" />{' '}
					{guide.createdAt.toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</span>
				<LikeButton
					guideId={guide.id}
					likeCount={guide.likeCount}
					size="lg"
					checkStatusOnMount
				/>
			</div>

			<div className="mt-8 overflow-hidden rounded-xl border border-border bg-secondary/40">
				{guide.coverImage ? (
					<img
						src={guide.coverImage}
						alt={guide.title}
						className="aspect-video w-full object-cover"
					/>
				) : (
					<div className="flex aspect-video w-full items-center justify-center text-muted-foreground/30">
						<ImageOff className="size-10" />
					</div>
				)}
			</div>

			<GuideBlocksView blocks={guide.content} />

			{linkedGuides.length > 0 && (
				<section className="mt-12">
					<h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
						<Link2 className="size-5 text-primary" /> Related builds
					</h2>
					<div className="grid gap-5 sm:grid-cols-2">
						{linkedGuides.map(g => (
							<GuideCard key={g.id} guide={g} />
						))}
					</div>
				</section>
			)}

			<CommentsContainer guideId={guide.id} />
		</article>
	)
}

export default Guide
