import { combineReducers } from 'redux'
import { notificationReducer } from './Notification.reducer'
import { categoryReducer } from './Category.reducer'

export const RootReducer = combineReducers({
	system: combineReducers({
		notification: notificationReducer,
		category: categoryReducer,
	}),
})
