// src/components/comments/Comments.component.tsx
import { Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from '@/components/link/Link.component'
import { CommentLikeButton } from '@/components/comment-like-button/CommentLikeButton.component'
import type { CommentItem } from '@/redux/types/Comment.type'

interface CommentsProps {
	guideId: string
	comments: CommentItem[]
	loading: boolean
	mutationLoading: boolean
	// currentUserId: string | null
	body: string
	onBodyChange: (value: string) => void
	onSubmit: () => void
	onDelete: (commentId: string) => void
}

function Comments({
	guideId,
	comments,
	loading,
	mutationLoading,
	// currentUserId,
	body,
	onBodyChange,
	onSubmit,
	onDelete,
}: CommentsProps) {
	return (
		<section className="mt-14 border-t border-border pt-8">
			<h2 className="mb-5 font-display text-xl font-bold">
				Comments <span className="text-muted-foreground">({comments.length})</span>
			</h2>

			{/* // TODO - Add auth */}
			{/* {currentUserId ? (
				<form
					onSubmit={e => {
						e.preventDefault()
						onSubmit()
					}}
					className="mb-8"
				>
					<textarea
						value={body}
						onChange={e => onBodyChange(e.target.value)}
						placeholder="Share your thoughts or ask a question..."
						maxLength={2000}
						rows={3}
						className="w-full resize-none rounded-md border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
					<div className="mt-2 flex justify-end">
						<Button
							type="submit"
							variant="default"
							size="sm"
							disabled={mutationLoading || !body.trim()}
						>
							<Send className="size-4" /> Post comment
						</Button>
					</div>
				</form>
			) : (
				<div className="mb-8 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
					<Link to="/auth" type="text">
						Sign in
					</Link>{' '}
					to join the discussion.
				</div>
			)} */}

			<form
				onSubmit={e => {
					e.preventDefault()
					onSubmit()
				}}
				className="mb-8"
			>
				<textarea
					value={body}
					onChange={e => onBodyChange(e.target.value)}
					placeholder="Share your thoughts or ask a question..."
					maxLength={2000}
					rows={3}
					className="w-full resize-none rounded-md border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
				/>
				<div className="mt-2 flex justify-end">
					<Button
						type="submit"
						variant="default"
						size="sm"
						disabled={mutationLoading || !body.trim()}
					>
						<Send className="size-4" /> Post comment
					</Button>
				</div>
			</form>

			{loading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-16 animate-pulse rounded-lg bg-card" />
					))}
				</div>
			) : comments.length === 0 ? (
				<p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
			) : (
				<ul className="space-y-5">
					{comments.map(comment => (
						<li key={comment.id} className="flex gap-3">
							<Avatar className="size-8 border border-border">
								<AvatarFallback className="bg-secondary text-xs">
									{comment.authorName.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										{comment.authorName}
									</span>
									<span className="text-xs text-muted-foreground">
										{comment.createdAt.toLocaleDateString()}
									</span>
									{/* // TODO - Add auth */}
									{/* {currentUserId === comment.authorId && (
										<button
											onClick={() => onDelete(comment.id)}
											className="ml-auto cursor-pointer text-muted-foreground hover:text-destructive"
											aria-label="Delete comment"
										>
											<Trash2 className="size-3.5" />
										</button>
									)} */}
								</div>
								<p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
									{comment.body}
								</p>
								<div className="mt-1.5">
									<CommentLikeButton
										guideId={guideId}
										commentId={comment.id}
										likeCount={comment.likeCount}
									/>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}

export default Comments
