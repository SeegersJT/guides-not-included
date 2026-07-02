export type GuideStatus = 'draft' | 'published'

export type GuideSort = 'recent' | 'liked'

export type GuideBlockType = 'text' | 'heading' | 'image' | 'youtube' | 'mentions'

export interface MentionEntry {
	id: string
	name: string
	url: string
	note: string
}

export interface TextBlock {
	id: string
	type: 'text'
	text: string
}

export interface HeadingBlock {
	id: string
	type: 'heading'
	text: string
}

export interface ImageBlock {
	id: string
	type: 'image'
	src: string
	caption: string
}

export interface YoutubeBlock {
	id: string
	type: 'youtube'
	url: string
	caption: string
}

export interface MentionsBlock {
	id: string
	type: 'mentions'
	heading: string
	entries: MentionEntry[]
}

export type GuideBlock = TextBlock | HeadingBlock | ImageBlock | YoutubeBlock | MentionsBlock

export interface GuideInput {
	title: string
	summary: string
	content: GuideBlock[]
	authorId: string
	authorName: string
	categoryId: string
	subcategoryId?: string
	coverImage: string | null
	linkedGuideIds: string[]
	tags: string[]
	status: GuideStatus
}

export interface GuideItem extends GuideInput {
	id: string
	likeCount: number
	commentCount: number
	createdAt: Date
	updatedAt: Date
}

export type GuideEditorSubmission = Omit<GuideInput, 'authorId' | 'authorName'>

export interface GuideListFilters {
	categoryId?: string
	subcategoryId?: string
	authorId?: string
	status?: GuideStatus
}

export interface GuideState {
	guideList: GuideItem[]
	guideListLoading: boolean
	activeGuide: GuideItem | null
	activeGuideLoading: boolean
	guideMutationLoading: boolean
	homeMostLiked: GuideItem[]
	homeMostLikedLoading: boolean
	homeRecent: GuideItem[]
	homeRecentLoading: boolean
	likedGuideIds: Record<string, boolean>
	likeMutationPending: Record<string, boolean>
}
