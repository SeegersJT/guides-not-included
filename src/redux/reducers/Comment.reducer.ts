import { COMMENT_ACTIONS } from '../actions/Comment.action'
import type { CommentItem, CommentState } from '../types/Comment.type'

const initialState: CommentState = {
	commentsByGuideId: {},
	commentsLoadingByGuideId: {},
	commentMutationLoading: false,
	likedCommentIds: {},
	commentLikeMutationPending: {},
}

type Action = { type: string; payload?: unknown }

export const commentReducer = (state = initialState, action: Action): CommentState => {
	switch (action.type) {
		case COMMENT_ACTIONS.SET_COMMENTS_LOADING: {
			const { guideId, loading } = action.payload as { guideId: string; loading: boolean }
			return {
				...state,
				commentsLoadingByGuideId: { ...state.commentsLoadingByGuideId, [guideId]: loading },
			}
		}

		case COMMENT_ACTIONS.SET_COMMENTS: {
			const { guideId, comments } = action.payload as {
				guideId: string
				comments: CommentItem[]
			}
			return {
				...state,
				commentsByGuideId: { ...state.commentsByGuideId, [guideId]: comments },
			}
		}

		case COMMENT_ACTIONS.ADD_COMMENT: {
			const { guideId, comment } = action.payload as { guideId: string; comment: CommentItem }
			return {
				...state,
				commentsByGuideId: {
					...state.commentsByGuideId,
					[guideId]: [comment, ...(state.commentsByGuideId[guideId] ?? [])],
				},
			}
		}

		case COMMENT_ACTIONS.DELETE_COMMENT: {
			const { guideId, commentId } = action.payload as { guideId: string; commentId: string }
			return {
				...state,
				commentsByGuideId: {
					...state.commentsByGuideId,
					[guideId]: (state.commentsByGuideId[guideId] ?? []).filter(
						c => c.id !== commentId
					),
				},
			}
		}

		case COMMENT_ACTIONS.SET_COMMENT_MUTATION_LOADING:
			return { ...state, commentMutationLoading: action.payload as boolean }

		case COMMENT_ACTIONS.SET_COMMENT_LIKE_STATE: {
			const { guideId, commentId, liked, likeCount } = action.payload as {
				guideId: string
				commentId: string
				liked: boolean
				likeCount: number
			}
			return {
				...state,
				likedCommentIds: { ...state.likedCommentIds, [commentId]: liked },
				commentsByGuideId: {
					...state.commentsByGuideId,
					[guideId]: (state.commentsByGuideId[guideId] ?? []).map(c =>
						c.id === commentId ? { ...c, likeCount } : c
					),
				},
			}
		}

		case COMMENT_ACTIONS.SET_COMMENT_LIKE_PENDING: {
			const { commentId, pending } = action.payload as { commentId: string; pending: boolean }
			return {
				...state,
				commentLikeMutationPending: {
					...state.commentLikeMutationPending,
					[commentId]: pending,
				},
			}
		}

		case COMMENT_ACTIONS.SET_COMMENT_LIKE_STATUSES: {
			const ids = action.payload as string[]
			const updates: Record<string, boolean> = {}
			ids.forEach(id => {
				updates[id] = true
			})
			return { ...state, likedCommentIds: { ...state.likedCommentIds, ...updates } }
		}

		default:
			return state
	}
}
