// src/containers/comments/Comments.container.tsx
import { useEffect, useState } from 'react'
import type { RootState } from '@/redux/types/Root.type'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
	requestComments,
	requestAddComment,
	requestDeleteComment,
	requestCommentLikeStatuses,
} from '@/redux/actions/Comment.action'
import Comments from '@/components/comments/Comments.component'

interface CommentsContainerProps {
	guideId: string
}

function CommentsContainer({ guideId }: CommentsContainerProps) {
	const dispatch = useAppDispatch()
	const [body, setBody] = useState('')

	const comments = useAppSelector(
		(state: RootState) => state.comment.commentsByGuideId[guideId] ?? []
	)
	const loading = useAppSelector(
		(state: RootState) => state.comment.commentsLoadingByGuideId[guideId] ?? false
	)
	const mutationLoading = useAppSelector(
		(state: RootState) => state.comment.commentMutationLoading
	)

	// TODO - Add auth
	// const currentUser = authService.getCurrentUser()

	useEffect(() => {
		dispatch(requestComments(guideId))
	}, [dispatch, guideId])

	useEffect(() => {
		// TODO - Add auth
		// if (comments.length > 0 && currentUser) {
		// 	dispatch(
		// 		requestCommentLikeStatuses(
		// 			guideId,
		// 			comments.map(c => c.id)
		// 		)
		// 	)
		// }
		if (comments.length > 0) {
			dispatch(
				requestCommentLikeStatuses(
					guideId,
					comments.map(comment => comment.id)
				)
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, guideId, comments.length])

	const handleSubmit = () => {
		const clean = body.trim()

		if (!clean) return

		dispatch(requestAddComment(guideId, clean, () => setBody('')))
	}

	const handleDelete = (commentId: string) => {
		dispatch(requestDeleteComment(guideId, commentId))
	}

	return (
		<Comments
			guideId={guideId}
			comments={comments}
			loading={loading}
			mutationLoading={mutationLoading}
			// currentUserId={currentUser?.uid ?? null}
			body={body}
			onBodyChange={setBody}
			onSubmit={handleSubmit}
			onDelete={handleDelete}
		/>
	)
}

export default CommentsContainer
