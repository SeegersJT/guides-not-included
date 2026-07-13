export interface CommentInput {
	guideId: string
	authorId: string
	authorName: string
	body: string
}

export interface CommentItem extends CommentInput {
	id: string
	likeCount: number
	createdAt: Date
	updatedAt: Date
}

export interface CommentState {
	commentsByGuideId: Record<string, CommentItem[]>
	commentsLoadingByGuideId: Record<string, boolean>
	commentMutationLoading: boolean
	likedCommentIds: Record<string, boolean>
	commentLikeMutationPending: Record<string, boolean>
}
