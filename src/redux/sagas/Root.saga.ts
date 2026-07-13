import { all } from 'redux-saga/effects'
import { notificationSaga } from './Notification.saga'
import { categorySaga } from './Category.saga'
import { guideSaga } from './Guide.saga'
import { commentSaga } from './Comment.saga'

export function* RootSaga() {
	yield all([notificationSaga(), categorySaga(), guideSaga(), commentSaga()])
}
