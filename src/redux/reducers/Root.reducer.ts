import { combineReducers } from 'redux'
import { notificationReducer } from './Notification.reducer'
import { categoryReducer } from './Category.reducer'
import { guideReducer } from './Guide.reducer'
import { commentReducer } from './Comment.reducer'

export const RootReducer = combineReducers({
	system: combineReducers({
		notification: notificationReducer,
		category: categoryReducer,
	}),
	guide: guideReducer,
	comment: commentReducer,
})
