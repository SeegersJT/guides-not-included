import { call, put, takeEvery } from 'redux-saga/effects'
import { firestoreService } from '@/firebase'
import type {
	CategoryInput,
	CategoryItem,
	SubCategoryInput,
	SubCategoryItem,
} from '../types/Category.type'
import {
	addCategory,
	addSubcategory,
	CATEGORY_ACTIONS,
	deleteCategory,
	deleteSubcategory,
	setCategoryData,
	setCategoryDataLoading,
	setCategoryMutationLoading,
	updateCategory,
	updateSubcategory,
} from '../actions/Category.action'
import { handleSagaError } from './Error.saga'

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
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_CATEGORY_DATA' })
	} finally {
		yield put(setCategoryDataLoading(false))
	}
}

function* handleRequestAddCategory(action: { type: string; payload: CategoryInput }) {
	yield put(setCategoryMutationLoading(true))

	try {
		const id: string = yield call(
			firestoreService.add<CategoryInput>,
			'categories',
			action.payload
		)

		yield put(addCategory({ id, ...action.payload }))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_ADD_CATEGORY' })
	} finally {
		yield put(setCategoryMutationLoading(false))
	}
}

function* handleRequestUpdateCategory(action: {
	type: string
	payload: { id: string; changes: Partial<CategoryInput> }
}) {
	const { id, changes } = action.payload

	yield put(setCategoryMutationLoading(true))

	try {
		yield call(firestoreService.update, 'categories', id, changes)

		yield put(updateCategory(id, changes))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_UPDATE_CATEGORY' })
	} finally {
		yield put(setCategoryMutationLoading(false))
	}
}

function* handleRequestDeleteCategory(action: { type: string; payload: { id: string } }) {
	yield put(setCategoryMutationLoading(true))

	try {
		yield call(firestoreService.remove, 'categories', action.payload.id)

		yield put(deleteCategory(action.payload.id))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_DELETE_CATEGORY' })
	} finally {
		yield put(setCategoryMutationLoading(false))
	}
}

function* handleRequestAddSubcategory(action: {
	type: string
	payload: { categoryId: string; subcategory: SubCategoryInput }
}) {
	const { categoryId, subcategory } = action.payload

	const newSubcategory: SubCategoryItem = { id: crypto.randomUUID(), ...subcategory }

	yield put(setCategoryMutationLoading(true))

	try {
		yield call(
			firestoreService.addToArray,
			'categories',
			categoryId,
			'subcategories',
			newSubcategory
		)

		yield put(addSubcategory(categoryId, newSubcategory))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_ADD_SUBCATEGORY' })
	} finally {
		yield put(setCategoryMutationLoading(false))
	}
}

function* handleRequestUpdateSubcategory(action: {
	type: string
	payload: { categoryId: string; subcategoryId: string; changes: Partial<SubCategoryInput> }
}) {
	const { categoryId, subcategoryId, changes } = action.payload

	yield put(setCategoryMutationLoading(true))

	try {
		yield call(
			firestoreService.updateArrayItem<SubCategoryItem>,
			'categories',
			categoryId,
			'subcategories',
			subcategoryId,
			changes
		)

		yield put(updateSubcategory(categoryId, subcategoryId, changes))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_UPDATE_SUBCATEGORY' })
	} finally {
		yield put(setCategoryMutationLoading(false))
	}
}

function* handleRequestDeleteSubcategory(action: {
	type: string
	payload: { categoryId: string; subcategoryId: string }
}) {
	const { categoryId, subcategoryId } = action.payload

	yield put(setCategoryMutationLoading(true))

	try {
		yield call(
			firestoreService.removeArrayItem,
			'categories',
			categoryId,
			'subcategories',
			subcategoryId
		)

		yield put(deleteSubcategory(categoryId, subcategoryId))
	} catch (err) {
		yield* handleSagaError(err, { title: 'Category', context: 'REQUEST_DELETE_SUBCATEGORY' })
	} finally {
		yield put(setCategoryMutationLoading(false))
	}
}

export function* categorySaga() {
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_CATEGORY_DATA, handleRequestCategoryData)
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_ADD_CATEGORY, handleRequestAddCategory)
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_UPDATE_CATEGORY, handleRequestUpdateCategory)
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_DELETE_CATEGORY, handleRequestDeleteCategory)
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_ADD_SUBCATEGORY, handleRequestAddSubcategory)
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_UPDATE_SUBCATEGORY, handleRequestUpdateSubcategory)
	yield takeEvery(CATEGORY_ACTIONS.REQUEST_DELETE_SUBCATEGORY, handleRequestDeleteSubcategory)
}
