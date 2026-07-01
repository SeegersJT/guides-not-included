import type { CategoryState } from './Category.type'
import type { GuideState } from './Guide.type'
import type { NotificationState } from './Notification.type'

export interface RootState {
	system: {
		notification: NotificationState
		category: CategoryState
	}
	guide: GuideState
}
