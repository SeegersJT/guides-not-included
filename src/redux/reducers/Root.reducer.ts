import { combineReducers } from 'redux'
import { notificationReducer } from './Notification.reducer'
import { categoryReducer } from './Category.reducer'
import { guideReducer } from './Guide.reducer'

export const RootReducer = combineReducers({
	system: combineReducers({
		notification: notificationReducer,
		category: categoryReducer,
	}),
	guide: guideReducer,
})
