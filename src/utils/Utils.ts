import { Timestamp } from 'firebase/firestore'
import type { StockAvailabilityItem } from './Utils.type'

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

	static calculateStockAvailability(quantity: number | null | undefined): StockAvailabilityItem {
		if (!quantity) {
			return { label: 'Information Unavailable', icon: 'none', variant: 'destructive' }
		}

		if (quantity <= 0) {
			return { label: 'No Stock', icon: 'none', variant: 'destructive' }
		}

		if (quantity < 10) {
			return { label: `Only ${quantity} left`, icon: 'warning', variant: 'warning' }
		}

		return { label: 'In Stock', icon: 'check', variant: 'success' }
	}
}
