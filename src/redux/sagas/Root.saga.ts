import { all } from 'redux-saga/effects'
import { notificationSaga } from './Notification.saga'
import { categorySaga } from './Category.saga'
import { guideSaga } from './Guide.saga'

export function* RootSaga() {
	yield all([notificationSaga(), categorySaga(), guideSaga()])
}
