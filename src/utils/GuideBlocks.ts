import type { GuideBlock, GuideBlockType } from '@/redux/types/Guide.type'
import { base64Size } from './Image'

export const newId = () => crypto.randomUUID()

export const BLOCK_META: Record<GuideBlockType, { label: string; description: string }> = {
	text: { label: 'Text', description: 'A paragraph of formatted text' },
	heading: { label: 'Heading', description: 'A section title' },
	image: { label: 'Image', description: 'A screenshot with an optional caption' },
	youtube: { label: 'YouTube', description: 'An embedded video' },
	mentions: { label: 'Credits', description: 'Recognise builders you referenced' },
}

export const createBlock = (type: GuideBlockType): GuideBlock => {
	const id = newId()
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

export const getYoutubeId = (url: string): string | null => {
	const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
	return match ? match[1] : null
}

export const MAX_TOTAL_IMAGE_BYTES = 3_000_000

export const totalImagePayloadSize = (blocks: GuideBlock[], coverImage: string | null): number => {
	const blockBytes = blocks
		.filter((b): b is Extract<GuideBlock, { type: 'image' }> => b.type === 'image')
		.reduce((sum, b) => sum + (b.src ? base64Size(b.src) : 0), 0)
	const coverBytes = coverImage ? base64Size(coverImage) : 0
	return blockBytes + coverBytes
}
