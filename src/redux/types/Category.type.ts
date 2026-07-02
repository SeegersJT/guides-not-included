export type CategoryInput = Omit<CategoryItem, 'id'>
export type SubCategoryInput = Omit<SubCategoryItem, 'id'>

export interface SubCategoryItem {
	id: string
	name: string
	order: number
}

export interface CategoryItem {
	id: string
	name: string
	color: string
	order: number
	subcategories: SubCategoryItem[]
}

export interface CategoryState {
	categoryData: CategoryItem[]
	categoryDataLoading: boolean
	categoryMutationLoading: boolean
}
