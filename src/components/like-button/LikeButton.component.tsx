import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RootState } from '@/redux/types/Root.type'
import { useAppSelector } from '@/hooks/useAppSelector'
import { requestToggleLike, requestLikeStatus } from '@/redux/actions/Guide.action'

interface LikeButtonProps {
	guideId: string
	likeCount: number
	size?: 'sm' | 'lg'
	className?: string
	checkStatusOnMount?: boolean
}

export function LikeButton({
	guideId,
	likeCount,
	size = 'sm',
	className,
	checkStatusOnMount = false,
}: LikeButtonProps) {
	const dispatch = useDispatch()

	const liked = useAppSelector((state: RootState) => state.guide.likedGuideIds[guideId] ?? false)
	const pending = useAppSelector(
		(state: RootState) => state.guide.likeMutationPending[guideId] ?? false
	)

	useEffect(() => {
		if (checkStatusOnMount) {
			dispatch(requestLikeStatus(guideId))
		}
	}, [checkStatusOnMount, guideId, dispatch])

	const toggle = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (pending) return

		dispatch(requestToggleLike(guideId))
	}

	return (
		<button
			type="button"
			onClick={toggle}
			disabled={pending}
			aria-pressed={liked}
			aria-label={liked ? 'Remove like' : 'Like this guide'}
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors cursor-pointer disabled:opacity-60',
				size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs',
				liked
					? 'border-destructive/40 bg-destructive/15 text-destructive'
					: 'border-border bg-secondary/60 text-muted-foreground hover:text-foreground hover:border-destructive/40',
				className
			)}
		>
			<Heart className={cn(size === 'lg' ? 'size-4' : 'size-3.5', liked && 'fill-current')} />
			<span>{likeCount}</span>
		</button>
	)
}
