import type { CategoryItem } from '../types/Category.type'

export const CATEGORY_ACTIONS = {
	REQUEST_CATEGORY_DATA: '[CATEGORY] - REQUEST - CATEGORY DATA',
	SET_CATEGORY_DATA_LOADING: '[CATEGORY] - SET - CATEGORY DATA LOADING',
	SET_CATEGORY_DATA: '[CATEGORY] - SET - CATEGORY DATA',
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
