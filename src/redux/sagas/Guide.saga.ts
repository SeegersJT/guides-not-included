import { call, put, takeEvery } from 'redux-saga/effects'
import { firestoreService } from '@/firebase'
import type {
	GuideEditorSubmission,
	GuideInput,
	GuideItem,
	GuideListFilters,
} from '../types/Guide.type'
import {
	addGuide,
	deleteGuide,
	GUIDE_ACTIONS,
	setActiveGuide,
	setActiveGuideLoading,
	setGuideList,
	setGuideListLoading,
	setGuideMutationLoading,
	setHomeMostLiked,
	setHomeMostLikedLoading,
	setHomeRecent,
	setHomeRecentLoading,
	setLikePending,
	setLikeState,
	setLikeStatusOnly,
	updateGuide,
} from '../actions/Guide.action'
import { handleSagaError } from './Error.saga'

function* handleRequestGuideList(action: { type: string; payload: GuideListFilters }) {
	const { categoryId, subcategoryId, authorId, status } = action.payload

	yield put(setGuideListLoading(true))

	try {
		const constraints = []

		if (categoryId) {
			constraints.push(firestoreService.where('categoryId', '==', categoryId))
		}

		if (subcategoryId) {
			constraints.push(firestoreService.where('subcategoryId', '==', subcategoryId))
		}

		if (authorId) {
			constraints.push(firestoreService.where('authorId', '==', authorId))
		}

		constraints.push(firestoreService.where('status', '==', status ?? 'published'))
		constraints.push(firestoreService.orderBy('createdAt', 'desc'))

		const guideList: GuideItem[] = yield call(
			firestoreService.getAll<GuideItem>,
			'guides',
			constraints
		)

		yield put(setGuideList(guideList))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_GUIDE_LIST' })
	} finally {
		yield put(setGuideListLoading(false))
	}
}

function* handleRequestGuideById(action: { type: string; payload: { id: string } }) {
	yield put(setActiveGuideLoading(true))

	try {
		const guide: GuideItem | null = yield call(
			firestoreService.getById<GuideItem>,
			'guides',
			action.payload.id
		)

		yield put(setActiveGuide(guide))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_GUIDE_BY_ID' })
	} finally {
		yield put(setActiveGuideLoading(false))
	}
}

function* handleRequestAddGuide(action: {
	type: string
	payload: { submission: GuideEditorSubmission; onSuccess?: (id: string) => void }
}) {
	yield put(setGuideMutationLoading(true))

	try {
		// const user = authService.getCurrentUser()
		// if (!user) throw new Error('You must be signed in to publish a guide.')

		const { submission, onSuccess } = action.payload

		const input: GuideInput & { likeCount: number; commentCount: number } = {
			...submission,
			// authorId: user.uid,
			// authorName: user.displayName ?? 'Duplicant',
			authorId: 'hannoisawesome',
			authorName: 'hannoisawesome',
			likeCount: 0,
			commentCount: 0,
		}

		const id: string = yield call(firestoreService.add<typeof input>, 'guides', input)

		yield put(
			addGuide({
				id,
				...input,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		)

		onSuccess?.(id)
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_ADD_GUIDE' })
	} finally {
		yield put(setGuideMutationLoading(false))
	}
}

function* handleRequestUpdateGuide(action: {
	type: string
	payload: { id: string; submission: GuideEditorSubmission; onSuccess?: () => void }
}) {
	yield put(setGuideMutationLoading(true))

	try {
		// const user = authService.getCurrentUser()
		// if (!user) throw new Error('You must be signed in to edit a guide.')

		const { id, submission, onSuccess } = action.payload

		const changes: Partial<GuideInput> = { ...submission }

		yield call(firestoreService.update, 'guides', id, changes)
		yield put(updateGuide(id, changes))

		onSuccess?.()
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_UPDATE_GUIDE' })
	} finally {
		yield put(setGuideMutationLoading(false))
	}
}

function* handleRequestDeleteGuide(action: {
	type: string
	payload: { id: string; onSuccess?: () => void }
}) {
	yield put(setGuideMutationLoading(true))

	try {
		yield call(firestoreService.remove, 'guides', action.payload.id)
		yield put(deleteGuide(action.payload.id))

		action.payload.onSuccess?.()
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_DELETE_GUIDE' })
	} finally {
		yield put(setGuideMutationLoading(false))
	}
}

function* handleRequestHomeMostLiked(action: { type: string; payload: { limitCount: number } }) {
	yield put(setHomeMostLikedLoading(true))
	try {
		const constraints = [
			firestoreService.where('status', '==', 'published'),
			firestoreService.orderBy('likeCount', 'desc'),
			firestoreService.limit(action.payload.limitCount),
		]
		const guides: GuideItem[] = yield call(
			firestoreService.getAll<GuideItem>,
			'guides',
			constraints
		)
		yield put(setHomeMostLiked(guides))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_HOME_MOST_LIKED' })
	} finally {
		yield put(setHomeMostLikedLoading(false))
	}
}

function* handleRequestHomeRecent(action: { type: string; payload: { limitCount: number } }) {
	yield put(setHomeRecentLoading(true))
	try {
		const constraints = [
			firestoreService.where('status', '==', 'published'),
			firestoreService.orderBy('createdAt', 'desc'),
			firestoreService.limit(action.payload.limitCount),
		]
		const guides: GuideItem[] = yield call(
			firestoreService.getAll<GuideItem>,
			'guides',
			constraints
		)
		yield put(setHomeRecent(guides))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_HOME_RECENT' })
	} finally {
		yield put(setHomeRecentLoading(false))
	}
}

function* handleRequestToggleLike(action: { type: string; payload: { guideId: string } }) {
	const { guideId } = action.payload

	yield put(setLikePending(guideId, true))

	try {
		// const user = authService.getCurrentUser()
		// if (!user) throw new Error('You must be signed in to like a guide.')

		const { liked, likeCount } = yield call(
			firestoreService.toggleLike,
			guideId,
			// user.uid
			'hannosisawesome'
		)
		yield put(setLikeState(guideId, liked, likeCount))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_TOGGLE_LIKE' })
	} finally {
		yield put(setLikePending(guideId, false))
	}
}

function* handleRequestLikeStatus(action: { type: string; payload: { guideId: string } }) {
	// const user = authService.getCurrentUser()

	// if (!user) return

	try {
		const liked: boolean = yield call(
			firestoreService.getLikeStatus,
			action.payload.guideId,
			// user.uid
			'hannoisawesome'
		)

		if (liked) {
			yield put(setLikeStatusOnly(action.payload.guideId, true))
		}
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_LIKE_STATUS' })
	}
}

export function* guideSaga() {
	yield takeEvery(GUIDE_ACTIONS.REQUEST_GUIDE_LIST, handleRequestGuideList)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_GUIDE_BY_ID, handleRequestGuideById)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_ADD_GUIDE, handleRequestAddGuide)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_UPDATE_GUIDE, handleRequestUpdateGuide)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_DELETE_GUIDE, handleRequestDeleteGuide)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_HOME_MOST_LIKED, handleRequestHomeMostLiked)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_HOME_RECENT, handleRequestHomeRecent)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_TOGGLE_LIKE, handleRequestToggleLike)
	yield takeEvery(GUIDE_ACTIONS.REQUEST_LIKE_STATUS, handleRequestLikeStatus)
}
