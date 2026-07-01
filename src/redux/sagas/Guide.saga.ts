import { call, put, takeLatest } from 'redux-saga/effects'
import { firestoreService } from '@/firebase'
import type { GuideItem, GuideQuery } from '../types/Guide.type'
import { GUIDE_ACTIONS, setGuideData, setGuideDataLoading } from '../actions/Guide.action'
import { handleSagaError } from './Error.saga'
import type { QueryConstraint } from 'firebase/firestore'

function* handleRequestGuideData(action: { type: string; payload: GuideQuery }) {
	const { subcategoryId, sort } = action.payload
	yield put(setGuideDataLoading(true))

	try {
		const constraints: QueryConstraint[] = subcategoryId
			? [firestoreService.where('subcategoryId', '==', subcategoryId)]
			: []

		constraints.push(
			firestoreService.orderBy(sort === 'liked' ? 'likeCount' : 'createdAt', 'desc')
		)

		const guideData: GuideItem[] = yield call(
			firestoreService.getAll<GuideItem>,
			'guides',
			constraints
		)
		yield put(setGuideData(guideData))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Guide', context: 'REQUEST_GUIDE_DATA' })
	} finally {
		yield put(setGuideDataLoading(false))
	}
}

export function* guideSaga() {
	yield takeLatest(GUIDE_ACTIONS.REQUEST_GUIDE_DATA, handleRequestGuideData)
}
