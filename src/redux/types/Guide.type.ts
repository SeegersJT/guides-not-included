export interface GuideItem {
	id: string
	author_id: string
	author_username: string
	title: string
	summary: string
	category_id: string
	category_name: string
	sub_category_id: string
	sub_category_name: string
	content: string
	cover_image_url: string
	created_at: Date
	updated_at: Date
}

export interface GuideState {
	guideData: GuideItem[]
}
