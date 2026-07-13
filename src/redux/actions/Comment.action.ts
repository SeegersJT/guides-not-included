import type { CommentItem } from '../types/Comment.type'

export const COMMENT_ACTIONS = {
	REQUEST_COMMENTS: '[COMMENT] - REQUEST - COMMENTS',
	SET_COMMENTS: '[COMMENT] - SET - COMMENTS',
	SET_COMMENTS_LOADING: '[COMMENT] - SET - COMMENTS LOADING',

	REQUEST_ADD_COMMENT: '[COMMENT] - REQUEST - ADD COMMENT',
	ADD_COMMENT: '[COMMENT] - ADD - COMMENT',

	REQUEST_DELETE_COMMENT: '[COMMENT] - REQUEST - DELETE COMMENT',
	DELETE_COMMENT: '[COMMENT] - DELETE - COMMENT',

	SET_COMMENT_MUTATION_LOADING: '[COMMENT] - SET - COMMENT MUTATION LOADING',

	REQUEST_TOGGLE_COMMENT_LIKE: '[COMMENT] - REQUEST - TOGGLE COMMENT LIKE',
	SET_COMMENT_LIKE_STATE: '[COMMENT] - SET - COMMENT LIKE STATE',
	SET_COMMENT_LIKE_PENDING: '[COMMENT] - SET - COMMENT LIKE PENDING',

	REQUEST_COMMENT_LIKE_STATUSES: '[COMMENT] - REQUEST - COMMENT LIKE STATUSES',
	SET_COMMENT_LIKE_STATUSES: '[COMMENT] - SET - COMMENT LIKE STATUSES',
} as const

export const requestComments = (guideId: string) => ({
	type: COMMENT_ACTIONS.REQUEST_COMMENTS,
	payload: { guideId },
})

export const setComments = (guideId: string, comments: CommentItem[]) => ({
	type: COMMENT_ACTIONS.SET_COMMENTS,
	payload: { guideId, comments },
})

export const setCommentsLoading = (guideId: string, loading: boolean) => ({
	type: COMMENT_ACTIONS.SET_COMMENTS_LOADING,
	payload: { guideId, loading },
})

export const requestAddComment = (guideId: string, body: string, onSuccess?: () => void) => ({
	type: COMMENT_ACTIONS.REQUEST_ADD_COMMENT,
	payload: { guideId, body, onSuccess },
})

export const addComment = (guideId: string, comment: CommentItem) => ({
	type: COMMENT_ACTIONS.ADD_COMMENT,
	payload: { guideId, comment },
})

export const requestDeleteComment = (guideId: string, commentId: string) => ({
	type: COMMENT_ACTIONS.REQUEST_DELETE_COMMENT,
	payload: { guideId, commentId },
})

export const deleteComment = (guideId: string, commentId: string) => ({
	type: COMMENT_ACTIONS.DELETE_COMMENT,
	payload: { guideId, commentId },
})

export const setCommentMutationLoading = (loading: boolean) => ({
	type: COMMENT_ACTIONS.SET_COMMENT_MUTATION_LOADING,
	payload: loading,
})

export const requestToggleCommentLike = (guideId: string, commentId: string) => ({
	type: COMMENT_ACTIONS.REQUEST_TOGGLE_COMMENT_LIKE,
	payload: { guideId, commentId },
})

export const setCommentLikeState = (
	guideId: string,
	commentId: string,
	liked: boolean,
	likeCount: number
) => ({
	type: COMMENT_ACTIONS.SET_COMMENT_LIKE_STATE,
	payload: { guideId, commentId, liked, likeCount },
})

export const setCommentLikePending = (commentId: string, pending: boolean) => ({
	type: COMMENT_ACTIONS.SET_COMMENT_LIKE_PENDING,
	payload: { commentId, pending },
})

export const requestCommentLikeStatuses = (guideId: string, commentIds: string[]) => ({
	type: COMMENT_ACTIONS.REQUEST_COMMENT_LIKE_STATUSES,
	payload: { guideId, commentIds },
})

export const setCommentLikeStatuses = (likedCommentIds: string[]) => ({
	type: COMMENT_ACTIONS.SET_COMMENT_LIKE_STATUSES,
	payload: likedCommentIds,
})
