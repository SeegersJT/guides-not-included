import { GUIDE_ACTIONS } from '../actions/Guide.action'
import type { GuideItem, GuideState } from '../types/Guide.type'

const initialState: GuideState = {
	guideList: [],
	guideListLoading: false,
	activeGuide: null,
	activeGuideLoading: false,
	guideMutationLoading: false,
	homeMostLiked: [],
	homeMostLikedLoading: false,
	homeRecent: [],
	homeRecentLoading: false,
	likedGuideIds: {},
	likeMutationPending: {},
}

type Action = { type: string; payload?: unknown }

export const guideReducer = (state = initialState, action: Action): GuideState => {
	switch (action.type) {
		case GUIDE_ACTIONS.SET_GUIDE_LIST_LOADING:
			return {
				...state,
				guideListLoading: action.payload as boolean,
			}

		case GUIDE_ACTIONS.SET_GUIDE_LIST:
			return {
				...state,
				guideList: action.payload as GuideItem[],
			}

		case GUIDE_ACTIONS.SET_ACTIVE_GUIDE_LOADING:
			return {
				...state,
				activeGuideLoading: action.payload as boolean,
			}

		case GUIDE_ACTIONS.SET_ACTIVE_GUIDE:
			return {
				...state,
				activeGuide: action.payload as GuideItem | null,
			}

		case GUIDE_ACTIONS.CLEAR_ACTIVE_GUIDE:
			return {
				...state,
				activeGuide: null,
			}

		case GUIDE_ACTIONS.SET_GUIDE_MUTATION_LOADING:
			return {
				...state,
				guideMutationLoading: action.payload as boolean,
			}

		case GUIDE_ACTIONS.ADD_GUIDE:
			return {
				...state,
				guideList: [action.payload as GuideItem, ...state.guideList],
			}

		case GUIDE_ACTIONS.UPDATE_GUIDE: {
			const { id, changes } = action.payload as { id: string; changes: Partial<GuideItem> }
			return {
				...state,
				guideList: state.guideList.map(guide =>
					guide.id === id ? { ...guide, ...changes } : guide
				),
				activeGuide:
					state.activeGuide?.id === id
						? { ...state.activeGuide, ...changes }
						: state.activeGuide,
			}
		}

		case GUIDE_ACTIONS.DELETE_GUIDE: {
			const { id } = action.payload as { id: string }
			return {
				...state,
				guideList: state.guideList.filter(guide => guide.id !== id),
				activeGuide: state.activeGuide?.id === id ? null : state.activeGuide,
			}
		}

		case GUIDE_ACTIONS.SET_HOME_MOST_LIKED:
			return {
				...state,
				homeMostLiked: action.payload as GuideItem[],
			}

		case GUIDE_ACTIONS.SET_HOME_MOST_LIKED_LOADING:
			return {
				...state,
				homeMostLikedLoading: action.payload as boolean,
			}

		case GUIDE_ACTIONS.SET_HOME_RECENT:
			return {
				...state,
				homeRecent: action.payload as GuideItem[],
			}

		case GUIDE_ACTIONS.SET_HOME_RECENT_LOADING:
			return {
				...state,
				homeRecentLoading: action.payload as boolean,
			}

		case GUIDE_ACTIONS.SET_LIKE_STATE: {
			const { guideId, liked, likeCount } = action.payload as {
				guideId: string
				liked: boolean
				likeCount: number
			}
			return {
				...state,
				likedGuideIds: { ...state.likedGuideIds, [guideId]: liked },
				guideList: state.guideList.map(guide =>
					guide.id === guideId ? { ...guide, likeCount } : guide
				),
				homeMostLiked: state.homeMostLiked.map(guide =>
					guide.id === guideId ? { ...guide, likeCount } : guide
				),
				homeRecent: state.homeRecent.map(guide =>
					guide.id === guideId ? { ...guide, likeCount } : guide
				),
				activeGuide:
					state.activeGuide?.id === guideId
						? { ...state.activeGuide, likeCount }
						: state.activeGuide,
			}
		}
		case GUIDE_ACTIONS.SET_LIKE_PENDING: {
			const { guideId, pending } = action.payload as { guideId: string; pending: boolean }

			return {
				...state,
				likeMutationPending: { ...state.likeMutationPending, [guideId]: pending },
			}
		}

		case GUIDE_ACTIONS.SET_LIKE_STATUS_ONLY: {
			const { guideId, liked } = action.payload as { guideId: string; liked: boolean }

			return {
				...state,
				likedGuideIds: {
					...state.likedGuideIds,
					[guideId]: liked,
				},
			}
		}

		default:
			return state
	}
}
