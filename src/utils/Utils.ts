import { Timestamp } from 'firebase/firestore'
import type { GuideBlock, GuideBlockType } from '@/redux/types/Guide.type'
import type { CategoryItem } from '@/redux/types/Category.type'

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

	static newId = () => crypto.randomUUID()

	static BLOCK_META: Record<GuideBlockType, { label: string; description: string }> = {
		text: { label: 'Text', description: 'A paragraph of formatted text' },
		heading: { label: 'Heading', description: 'A section title' },
		image: { label: 'Image', description: 'A screenshot with an optional caption' },
		youtube: { label: 'YouTube', description: 'An embedded video' },
		mentions: { label: 'Credits', description: 'Recognise builders you referenced' },
	}

	static createBlock = (type: GuideBlockType): GuideBlock => {
		const id = this.newId()
		switch (type) {
			case 'text':
				return { id, type: 'text', text: '' }
			case 'heading':
				return { id, type: 'heading', text: '' }
			case 'image':
				return { id, type: 'image', src: '', caption: '' }
			case 'youtube':
				return { id, type: 'youtube', url: '', caption: '' }
			case 'mentions':
				return { id, type: 'mentions', heading: 'Credits & references', entries: [] }
		}
	}

	static getYoutubeId = (url: string): string | null => {
		const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
		return match ? match[1] : null
	}

	static buildSubcategoryMeta = (
		categoryData: CategoryItem[]
	): Map<string, { name: string; color: string }> => {
		const map = new Map<string, { name: string; color: string }>()

		for (const category of categoryData) {
			for (const sub of category.subcategories) {
				map.set(sub.id, { name: sub.name, color: category.color })
			}
		}

		return map
	}
}
