import type {
	CategoryInput,
	CategoryItem,
	SubCategoryInput,
	SubCategoryItem,
} from '../types/Category.type'

export const CATEGORY_ACTIONS = {
	REQUEST_CATEGORY_DATA: '[CATEGORY] - REQUEST - CATEGORY DATA',
	SET_CATEGORY_DATA_LOADING: '[CATEGORY] - SET - CATEGORY DATA LOADING',
	SET_CATEGORY_DATA: '[CATEGORY] - SET - CATEGORY DATA',

	REQUEST_ADD_CATEGORY: '[CATEGORY] - REQUEST - ADD CATEGORY',
	REQUEST_UPDATE_CATEGORY: '[CATEGORY] - REQUEST - UPDATE CATEGORY',
	REQUEST_DELETE_CATEGORY: '[CATEGORY] - REQUEST - DELETE CATEGORY',

	SET_CATEGORY_MUTATION_LOADING: '[CATEGORY] - SET - CATEGORY MUTATION LOADING',

	ADD_CATEGORY: '[CATEGORY] - ADD - CATEGORY',
	UPDATE_CATEGORY: '[CATEGORY] - UPDATE - CATEGORY',
	DELETE_CATEGORY: '[CATEGORY] - DELETE - CATEGORY',

	REQUEST_ADD_SUBCATEGORY: '[CATEGORY] - REQUEST - ADD SUBCATEGORY',
	REQUEST_UPDATE_SUBCATEGORY: '[CATEGORY] - REQUEST - UPDATE SUBCATEGORY',
	REQUEST_DELETE_SUBCATEGORY: '[CATEGORY] - REQUEST - DELETE SUBCATEGORY',

	ADD_SUBCATEGORY: '[CATEGORY] - ADD - SUBCATEGORY',
	UPDATE_SUBCATEGORY: '[CATEGORY] - UPDATE - SUBCATEGORY',
	DELETE_SUBCATEGORY: '[CATEGORY] - DELETE - SUBCATEGORY',
} as const

export const requestCategoryData = () => ({
	type: CATEGORY_ACTIONS.REQUEST_CATEGORY_DATA,
})

export const setCategoryDataLoading = (loading: boolean) => ({
	type: CATEGORY_ACTIONS.SET_CATEGORY_DATA_LOADING,
	payload: loading,
})

export const setCategoryData = (categoryData: CategoryItem[]) => ({
	type: CATEGORY_ACTIONS.SET_CATEGORY_DATA,
	payload: categoryData,
})

export const requestAddCategory = (payload: CategoryInput) => ({
	type: CATEGORY_ACTIONS.REQUEST_ADD_CATEGORY,
	payload,
})

export const requestUpdateCategory = (id: string, changes: Partial<CategoryInput>) => ({
	type: CATEGORY_ACTIONS.REQUEST_UPDATE_CATEGORY,
	payload: { id, changes },
})

export const requestDeleteCategory = (id: string) => ({
	type: CATEGORY_ACTIONS.REQUEST_DELETE_CATEGORY,
	payload: { id },
})

export const setCategoryMutationLoading = (loading: boolean) => ({
	type: CATEGORY_ACTIONS.SET_CATEGORY_MUTATION_LOADING,
	payload: loading,
})

export const addCategory = (category: CategoryItem) => ({
	type: CATEGORY_ACTIONS.ADD_CATEGORY,
	payload: category,
})

export const updateCategory = (id: string, changes: Partial<CategoryInput>) => ({
	type: CATEGORY_ACTIONS.UPDATE_CATEGORY,
	payload: { id, changes },
})

export const deleteCategory = (id: string) => ({
	type: CATEGORY_ACTIONS.DELETE_CATEGORY,
	payload: { id },
})

export const requestAddSubcategory = (categoryId: string, subcategory: SubCategoryInput) => ({
	type: CATEGORY_ACTIONS.REQUEST_ADD_SUBCATEGORY,
	payload: { categoryId, subcategory },
})

export const addSubcategory = (categoryId: string, subcategory: SubCategoryItem) => ({
	type: CATEGORY_ACTIONS.ADD_SUBCATEGORY,
	payload: { categoryId, subcategory },
})

export const requestUpdateSubcategory = (
	categoryId: string,
	subcategoryId: string,
	changes: Partial<SubCategoryInput>
) => ({
	type: CATEGORY_ACTIONS.REQUEST_UPDATE_SUBCATEGORY,
	payload: { categoryId, subcategoryId, changes },
})

export const requestDeleteSubcategory = (categoryId: string, subcategoryId: string) => ({
	type: CATEGORY_ACTIONS.REQUEST_DELETE_SUBCATEGORY,
	payload: { categoryId, subcategoryId },
})

export const updateSubcategory = (
	categoryId: string,
	subcategoryId: string,
	changes: Partial<SubCategoryInput>
) => ({
	type: CATEGORY_ACTIONS.UPDATE_SUBCATEGORY,
	payload: { categoryId, subcategoryId, changes },
})

export const deleteSubcategory = (categoryId: string, subcategoryId: string) => ({
	type: CATEGORY_ACTIONS.DELETE_SUBCATEGORY,
	payload: { categoryId, subcategoryId },
})
