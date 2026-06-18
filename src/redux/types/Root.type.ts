import type { NotificationState } from './Notification.type'

export interface RootState {
	system: {
		notification: NotificationState
	}
}
