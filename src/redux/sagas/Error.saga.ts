import { put } from 'redux-saga/effects'
import { addSystemNotification } from '../actions/Notification.action'

interface SagaErrorOptions {
	title: string
	message?: string
	context?: string
}

export function* handleSagaError(err: unknown, options: SagaErrorOptions) {
	// eslint-disable-next-line no-console
	console.error(`[Saga${options.context ? `:${options.context}` : ''}]`, err)

	yield put(
		addSystemNotification({
			type: 'error',
			title: options.title,
			message:
				options.message ?? (err instanceof Error ? err.message : 'Something went wrong'),
		})
	)
}
