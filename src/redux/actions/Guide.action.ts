import type { GuideEditorSubmission, GuideItem, GuideListFilters } from '../types/Guide.type'

export const GUIDE_ACTIONS = {
	REQUEST_GUIDE_LIST: '[GUIDE] - REQUEST - GUIDE LIST',
	SET_GUIDE_LIST: '[GUIDE] - SET - GUIDE LIST',
	SET_GUIDE_LIST_LOADING: '[GUIDE] - SET - GUIDE LIST LOADING',

	REQUEST_GUIDE_BY_ID: '[GUIDE] - REQUEST - GUIDE BY ID',
	SET_ACTIVE_GUIDE: '[GUIDE] - SET - ACTIVE GUIDE',
	SET_ACTIVE_GUIDE_LOADING: '[GUIDE] - SET - ACTIVE GUIDE LOADING',
	CLEAR_ACTIVE_GUIDE: '[GUIDE] - CLEAR - ACTIVE GUIDE',

	REQUEST_ADD_GUIDE: '[GUIDE] - REQUEST - ADD GUIDE',
	ADD_GUIDE: '[GUIDE] - ADD - GUIDE',

	REQUEST_UPDATE_GUIDE: '[GUIDE] - REQUEST - UPDATE GUIDE',
	UPDATE_GUIDE: '[GUIDE] - UPDATE - GUIDE',

	REQUEST_DELETE_GUIDE: '[GUIDE] - REQUEST - DELETE GUIDE',
	DELETE_GUIDE: '[GUIDE] - DELETE - GUIDE',

	SET_GUIDE_MUTATION_LOADING: '[GUIDE] - SET - GUIDE MUTATION LOADING',

	REQUEST_HOME_MOST_LIKED: '[GUIDE] - REQUEST - HOME MOST LIKED',
	SET_HOME_MOST_LIKED: '[GUIDE] - SET - HOME MOST LIKED',
	SET_HOME_MOST_LIKED_LOADING: '[GUIDE] - SET - HOME MOST LIKED LOADING',

	REQUEST_HOME_RECENT: '[GUIDE] - REQUEST - HOME RECENT',
	SET_HOME_RECENT: '[GUIDE] - SET - HOME RECENT',
	SET_HOME_RECENT_LOADING: '[GUIDE] - SET - HOME RECENT LOADING',

	REQUEST_TOGGLE_LIKE: '[GUIDE] - REQUEST - TOGGLE LIKE',
	REQUEST_LIKE_STATUS: '[GUIDE] - REQUEST - LIKE STATUS',
	SET_LIKE_STATE: '[GUIDE] - SET - LIKE STATE',
	SET_LIKE_PENDING: '[GUIDE] - SET - LIKE PENDING',

	SET_LIKE_STATUS_ONLY: '[GUIDE] - SET - LIKE STATUS ONLY',
} as const

export const requestGuideList = (filters: GuideListFilters = {}) => ({
	type: GUIDE_ACTIONS.REQUEST_GUIDE_LIST,
	payload: filters,
})

export const setGuideList = (guideList: GuideItem[]) => ({
	type: GUIDE_ACTIONS.SET_GUIDE_LIST,
	payload: guideList,
})

export const setGuideListLoading = (loading: boolean) => ({
	type: GUIDE_ACTIONS.SET_GUIDE_LIST_LOADING,
	payload: loading,
})

export const requestGuideById = (id: string) => ({
	type: GUIDE_ACTIONS.REQUEST_GUIDE_BY_ID,
	payload: { id },
})

export const setActiveGuide = (guide: GuideItem | null) => ({
	type: GUIDE_ACTIONS.SET_ACTIVE_GUIDE,
	payload: guide,
})

export const setActiveGuideLoading = (loading: boolean) => ({
	type: GUIDE_ACTIONS.SET_ACTIVE_GUIDE_LOADING,
	payload: loading,
})

export const clearActiveGuide = () => ({
	type: GUIDE_ACTIONS.CLEAR_ACTIVE_GUIDE,
})

export const requestAddGuide = (
	submission: GuideEditorSubmission,
	onSuccess?: (id: string) => void
) => ({
	type: GUIDE_ACTIONS.REQUEST_ADD_GUIDE,
	payload: { submission, onSuccess },
})

export const addGuide = (guide: GuideItem) => ({
	type: GUIDE_ACTIONS.ADD_GUIDE,
	payload: guide,
})

export const requestUpdateGuide = (
	id: string,
	submission: GuideEditorSubmission,
	onSuccess?: () => void
) => ({
	type: GUIDE_ACTIONS.REQUEST_UPDATE_GUIDE,
	payload: { id, submission, onSuccess },
})

export const updateGuide = (id: string, changes: Partial<GuideItem>) => ({
	type: GUIDE_ACTIONS.UPDATE_GUIDE,
	payload: { id, changes },
})

export const requestDeleteGuide = (id: string, onSuccess?: () => void) => ({
	type: GUIDE_ACTIONS.REQUEST_DELETE_GUIDE,
	payload: { id, onSuccess },
})

export const deleteGuide = (id: string) => ({
	type: GUIDE_ACTIONS.DELETE_GUIDE,
	payload: { id },
})

export const setGuideMutationLoading = (loading: boolean) => ({
	type: GUIDE_ACTIONS.SET_GUIDE_MUTATION_LOADING,
	payload: loading,
})

export const requestHomeMostLiked = (limitCount = 6) => ({
	type: GUIDE_ACTIONS.REQUEST_HOME_MOST_LIKED,
	payload: { limitCount },
})
export const setHomeMostLiked = (guides: GuideItem[]) => ({
	type: GUIDE_ACTIONS.SET_HOME_MOST_LIKED,
	payload: guides,
})
export const setHomeMostLikedLoading = (loading: boolean) => ({
	type: GUIDE_ACTIONS.SET_HOME_MOST_LIKED_LOADING,
	payload: loading,
})

export const requestHomeRecent = (limitCount = 6) => ({
	type: GUIDE_ACTIONS.REQUEST_HOME_RECENT,
	payload: { limitCount },
})
export const setHomeRecent = (guides: GuideItem[]) => ({
	type: GUIDE_ACTIONS.SET_HOME_RECENT,
	payload: guides,
})
export const setHomeRecentLoading = (loading: boolean) => ({
	type: GUIDE_ACTIONS.SET_HOME_RECENT_LOADING,
	payload: loading,
})

export const requestToggleLike = (guideId: string) => ({
	type: GUIDE_ACTIONS.REQUEST_TOGGLE_LIKE,
	payload: { guideId },
})

export const requestLikeStatus = (guideId: string) => ({
	type: GUIDE_ACTIONS.REQUEST_LIKE_STATUS,
	payload: { guideId },
})

export const setLikeState = (guideId: string, liked: boolean, likeCount: number) => ({
	type: GUIDE_ACTIONS.SET_LIKE_STATE,
	payload: { guideId, liked, likeCount },
})

export const setLikePending = (guideId: string, pending: boolean) => ({
	type: GUIDE_ACTIONS.SET_LIKE_PENDING,
	payload: { guideId, pending },
})

export const setLikeStatusOnly = (guideId: string, liked: boolean) => ({
	type: GUIDE_ACTIONS.SET_LIKE_STATUS_ONLY,
	payload: { guideId, liked },
})
