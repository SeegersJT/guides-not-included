import { CATEGORY_ACTIONS } from '../actions/Category.action'
import type { CategoryItem, CategoryState, SubCategoryItem } from '../types/Category.type'

const initialState: CategoryState = {
	categoryData: [],
	categoryDataLoading: false,
	categoryMutationLoading: false,
}

type Action = { type: string; payload?: unknown }

export const categoryReducer = (state = initialState, action: Action): CategoryState => {
	switch (action.type) {
		case CATEGORY_ACTIONS.SET_CATEGORY_DATA_LOADING:
			return {
				...state,
				categoryDataLoading: action.payload as boolean,
			}

		case CATEGORY_ACTIONS.SET_CATEGORY_DATA:
			return {
				...state,
				categoryData: action.payload as CategoryItem[],
			}

		case CATEGORY_ACTIONS.SET_CATEGORY_MUTATION_LOADING:
			return { ...state, categoryMutationLoading: action.payload as boolean }

		case CATEGORY_ACTIONS.ADD_CATEGORY:
			return {
				...state,
				categoryData: [...state.categoryData, action.payload as CategoryItem],
			}

		case CATEGORY_ACTIONS.UPDATE_CATEGORY: {
			const { id, changes } = action.payload as { id: string; changes: Partial<CategoryItem> }
			return {
				...state,
				categoryData: state.categoryData.map(category =>
					category.id === id ? { ...category, ...changes } : category
				),
			}
		}

		case CATEGORY_ACTIONS.DELETE_CATEGORY: {
			const { id } = action.payload as { id: string }
			return {
				...state,
				categoryData: state.categoryData.filter(category => category.id !== id),
			}
		}

		case CATEGORY_ACTIONS.ADD_SUBCATEGORY: {
			const { categoryId, subcategory } = action.payload as {
				categoryId: string
				subcategory: SubCategoryItem
			}
			return {
				...state,
				categoryData: state.categoryData.map(category =>
					category.id === categoryId
						? { ...category, subcategories: [...category.subcategories, subcategory] }
						: category
				),
			}
		}

		case CATEGORY_ACTIONS.UPDATE_SUBCATEGORY: {
			const { categoryId, subcategoryId, changes } = action.payload as {
				categoryId: string
				subcategoryId: string
				changes: Partial<SubCategoryItem>
			}
			return {
				...state,
				categoryData: state.categoryData.map(category =>
					category.id === categoryId
						? {
								...category,
								subcategories: category.subcategories.map(subcategory =>
									subcategory.id === subcategoryId
										? { ...subcategory, ...changes }
										: subcategory
								),
							}
						: category
				),
			}
		}

		case CATEGORY_ACTIONS.DELETE_SUBCATEGORY: {
			const { categoryId, subcategoryId } = action.payload as {
				categoryId: string
				subcategoryId: string
			}
			return {
				...state,
				categoryData: state.categoryData.map(category =>
					category.id === categoryId
						? {
								...category,
								subcategories: category.subcategories.filter(
									subcategory => subcategory.id !== subcategoryId
								),
							}
						: category
				),
			}
		}

		default:
			return state
	}
}
