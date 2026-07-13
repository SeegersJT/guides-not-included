import type { MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RootState } from '@/redux/types/Root.type'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { requestToggleCommentLike } from '@/redux/actions/Comment.action'

interface CommentLikeButtonProps {
	guideId: string
	commentId: string
	likeCount: number
	className?: string
}

export function CommentLikeButton({
	guideId,
	commentId,
	likeCount,
	className,
}: CommentLikeButtonProps) {
	const dispatch = useAppDispatch()

	const liked = useAppSelector(
		(state: RootState) => state.comment.likedCommentIds[commentId] ?? false
	)
	const pending = useAppSelector(
		(state: RootState) => state.comment.commentLikeMutationPending[commentId] ?? false
	)

	const toggle = (e: MouseEvent) => {
		e.preventDefault()
		if (pending) return
		dispatch(requestToggleCommentLike(guideId, commentId))
	}

	return (
		<button
			type="button"
			onClick={toggle}
			disabled={pending}
			aria-pressed={liked}
			aria-label={liked ? 'Remove like' : 'Like this comment'}
			className={cn(
				'inline-flex cursor-pointer items-center gap-1 text-xs font-medium transition-colors disabled:opacity-60',
				liked ? 'text-destructive' : 'text-muted-foreground hover:text-foreground',
				className
			)}
		>
			<Heart className={cn('size-3.5', liked && 'fill-current')} />
			<span>{likeCount}</span>
		</button>
	)
}
