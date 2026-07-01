export type GuideSort = 'recent' | 'liked'

export interface GuideItem {
	id: string
	title: string
	description: string
	content: string
	authorId: string
	authorName: string
	coverImageUrl?: string
	subcategoryId: string
	subcategoryName: string
	subcategoryColor: string
	likeCount: number
	createdAt: Date
	updatedAt: Date
}

export interface GuideQuery {
	subcategoryId: string | null
	sort: GuideSort
}

export interface GuideState {
	guideData: GuideItem[]
	guideDataLoading: boolean
}
