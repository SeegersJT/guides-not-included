import type { GuideItem, GuideQuery } from '../types/Guide.type'

export const GUIDE_ACTIONS = {
	REQUEST_GUIDE_DATA: '[GUIDE] - REQUEST - GUIDE DATA',
	SET_GUIDE_DATA_LOADING: '[GUIDE] - SET - GUIDE DATA LOADING',
	SET_GUIDE_DATA: '[GUIDE] - SET - GUIDE DATA',
} as const

export const requestGuideData = (query: GuideQuery) => ({
	type: GUIDE_ACTIONS.REQUEST_GUIDE_DATA,
	payload: query,
})

export const setGuideDataLoading = (loading: boolean) => ({
	type: GUIDE_ACTIONS.SET_GUIDE_DATA_LOADING,
	payload: loading,
})

export const setGuideData = (guideData: GuideItem[]) => ({
	type: GUIDE_ACTIONS.SET_GUIDE_DATA,
	payload: guideData,
})
