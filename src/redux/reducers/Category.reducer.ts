import { CATEGORY_ACTIONS } from '../actions/Category.action'
import type { CategoryItem, CategoryState } from '../types/Category.type'

const initialState: CategoryState = {
	categoryData: [],
	categoryDataLoading: false,
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

		default:
			return state
	}
}
