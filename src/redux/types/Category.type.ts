export interface SubCategoryItem {
	id: string
	name: string
	color: string
	order: number
}

export interface CategoryItem {
	id: string
	name: string
	icon: string
	order: string
	subcategories: SubCategoryItem[]
}

export interface CategoryState {
	categoryData: CategoryItem[]
	categoryDataLoading: boolean
}
