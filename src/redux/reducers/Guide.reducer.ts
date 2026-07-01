import { GUIDE_ACTIONS } from '../actions/Guide.action'
import type { GuideItem, GuideState } from '../types/Guide.type'

const initialState: GuideState = {
	guideData: [],
	guideDataLoading: false,
}

type Action = { type: string; payload?: unknown }

export const guideReducer = (state = initialState, action: Action): GuideState => {
	switch (action.type) {
		case GUIDE_ACTIONS.SET_GUIDE_DATA_LOADING:
			return { ...state, guideDataLoading: action.payload as boolean }

		case GUIDE_ACTIONS.SET_GUIDE_DATA:
			return { ...state, guideData: action.payload as GuideItem[] }

		default:
			return state
	}
}
