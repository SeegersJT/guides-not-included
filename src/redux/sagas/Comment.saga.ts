import { all, call, put, takeEvery } from 'redux-saga/effects'
import { authService, firestoreService } from '@/firebase'
import type { CommentInput, CommentItem } from '../types/Comment.type'
import {
	addComment,
	COMMENT_ACTIONS,
	deleteComment,
	setComments,
	setCommentsLoading,
	setCommentLikePending,
	setCommentLikeState,
	setCommentLikeStatuses,
	setCommentMutationLoading,
} from '../actions/Comment.action'
import { handleSagaError } from './Error.saga'

function* handleRequestComments(action: { type: string; payload: { guideId: string } }) {
	const { guideId } = action.payload
	yield put(setCommentsLoading(guideId, true))

	try {
		const comments: CommentItem[] = yield call(
			firestoreService.getAll<CommentItem>,
			`guides/${guideId}/comments`,
			[firestoreService.orderBy('createdAt', 'desc')]
		)
		yield put(setComments(guideId, comments))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Comment', context: 'REQUEST_COMMENTS' })
	} finally {
		yield put(setCommentsLoading(guideId, false))
	}
}

function* handleRequestAddComment(action: {
	type: string
	payload: { guideId: string; body: string; onSuccess?: () => void }
}) {
	yield put(setCommentMutationLoading(true))

	try {
		// const user = authService.getCurrentUser()
		// if (!user) throw new Error('You must be signed in to comment.')

		const { guideId, body, onSuccess } = action.payload

		const input: CommentInput = {
			guideId,
			authorId: 'hannoisawesome',
			authorName: 'hannoisawesome',
			body,
		}

		const id: string = yield call(firestoreService.addComment, guideId, input)

		yield put(
			addComment(guideId, {
				id,
				...input,
				likeCount: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		)

		onSuccess?.()
	} catch (err) {
		yield* handleSagaError(err, { title: 'Comment', context: 'REQUEST_ADD_COMMENT' })
	} finally {
		yield put(setCommentMutationLoading(false))
	}
}

function* handleRequestDeleteComment(action: {
	type: string
	payload: { guideId: string; commentId: string }
}) {
	yield put(setCommentMutationLoading(true))

	try {
		const { guideId, commentId } = action.payload

		yield call(firestoreService.removeComment, guideId, commentId)

		yield put(deleteComment(guideId, commentId))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Comment', context: 'REQUEST_DELETE_COMMENT' })
	} finally {
		yield put(setCommentMutationLoading(false))
	}
}

function* handleRequestToggleCommentLike(action: {
	type: string
	payload: { guideId: string; commentId: string }
}) {
	const { guideId, commentId } = action.payload

	yield put(setCommentLikePending(commentId, true))

	try {
		// const user = authService.getCurrentUser()
		// if (!user) throw new Error('You must be signed in to like a comment.')

		const { liked, likeCount } = yield call(
			firestoreService.toggleCommentLike,
			guideId,
			commentId,
			'hannoisawesome'
		)
		yield put(setCommentLikeState(guideId, commentId, liked, likeCount))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Comment', context: 'REQUEST_TOGGLE_COMMENT_LIKE' })
	} finally {
		yield put(setCommentLikePending(commentId, false))
	}
}

function* handleRequestCommentLikeStatuses(action: {
	type: string
	payload: { guideId: string; commentIds: string[] }
}) {
	// const user = authService.getCurrentUser()
	// if (!user) return

	const { guideId, commentIds } = action.payload
	if (commentIds.length === 0) return

	try {
		const results: boolean[] = yield all(
			commentIds.map(commentId =>
				call(firestoreService.getCommentLikeStatus, guideId, commentId, 'hannoisawesome')
			)
		)

		const likedIds = commentIds.filter((_, i) => results[i])
		if (likedIds.length > 0) {
			yield put(setCommentLikeStatuses(likedIds))
		}
	} catch (err) {
		yield* handleSagaError(err, { title: 'Comment', context: 'REQUEST_COMMENT_LIKE_STATUSES' })
	}
}

export function* commentSaga() {
	yield takeEvery(COMMENT_ACTIONS.REQUEST_COMMENTS, handleRequestComments)
	yield takeEvery(COMMENT_ACTIONS.REQUEST_ADD_COMMENT, handleRequestAddComment)
	yield takeEvery(COMMENT_ACTIONS.REQUEST_DELETE_COMMENT, handleRequestDeleteComment)
	yield takeEvery(COMMENT_ACTIONS.REQUEST_TOGGLE_COMMENT_LIKE, handleRequestToggleCommentLike)
	yield takeEvery(COMMENT_ACTIONS.REQUEST_COMMENT_LIKE_STATUSES, handleRequestCommentLikeStatuses)
}
