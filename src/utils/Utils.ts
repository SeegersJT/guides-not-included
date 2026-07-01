import { Timestamp } from 'firebase/firestore'

export class Utils {
	static convertTimestamps<T extends Record<string, unknown>>(obj: T): T {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => {
				if (value instanceof Timestamp) {
					return [key, Utils.formatDate(value.toDate())]
				}
				return [key, value]
			})
		) as T
	}

	static formatDate(date: Date): string {
		const pad = (n: number) => String(n).padStart(2, '0')
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
	}

	static formatPrice(amount: number, currency: string = 'ZAR'): string {
		return new Intl.NumberFormat('en-ZA', {
			style: 'currency',
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount)
	}
}
