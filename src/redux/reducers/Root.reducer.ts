import { combineReducers } from 'redux'
import { notificationReducer } from './Notification.reducer'

export const RootReducer = combineReducers({
	system: combineReducers({
		notification: notificationReducer,
	}),
})
