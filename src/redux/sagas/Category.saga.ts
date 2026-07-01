import { call, put, takeLatest } from 'redux-saga/effects'
import { firestoreService } from '@/firebase'
import type { CategoryItem } from '../types/Category.type'
import { addSystemNotification } from '../actions/Notification.action'
import {
	CATEGORY_ACTIONS,
	setCategoryData,
	setCategoryDataLoading,
} from '../actions/Category.action'

function* handleRequestCategoryData() {
	yield put(setCategoryDataLoading(true))

	try {
		const categoryData: CategoryItem[] = yield call(
			firestoreService.getAll<CategoryItem>,
			'categories',
			[firestoreService.orderBy('order', 'asc')]
		)
		yield put(setCategoryData(categoryData))
	} catch (err) {
		yield put(addSystemNotification({ type: 'error', title: 'Category', message: 'Failed' }))
	} finally {
		yield put(setCategoryDataLoading(false))
	}
}

export function* categorySaga() {
	yield takeLatest(CATEGORY_ACTIONS.REQUEST_CATEGORY_DATA, handleRequestCategoryData)
}
