const CONTENT_MAX_DIMENSION = 1280
const JPEG_QUALITY = 0.72

export const fileToCompressedBase64 = (
	file: File,
	maxDimension = CONTENT_MAX_DIMENSION,
	quality = JPEG_QUALITY
): Promise<string> =>
	new Promise((resolve, reject) => {
		loadImage(file)
			.then(img => {
				const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
				const width = Math.round(img.width * scale)
				const height = Math.round(img.height * scale)

				const canvas = document.createElement('canvas')
				canvas.width = width
				canvas.height = height

				const ctx = canvas.getContext('2d')
				if (!ctx) return reject(new Error('Canvas context unavailable'))

				ctx.drawImage(img, 0, 0, width, height)
				resolve(canvas.toDataURL('image/jpeg', quality))
			})
			.catch(reject)
	})

export const fileToCoverBase64 = (
	file: File,
	targetWidth: number,
	targetHeight: number,
	quality = JPEG_QUALITY
): Promise<string> =>
	new Promise((resolve, reject) => {
		loadImage(file)
			.then(img => {
				const scale = Math.max(targetWidth / img.width, targetHeight / img.height)
				const scaledWidth = img.width * scale
				const scaledHeight = img.height * scale

				const sx = (scaledWidth - targetWidth) / 2 / scale
				const sy = (scaledHeight - targetHeight) / 2 / scale
				const sWidth = targetWidth / scale
				const sHeight = targetHeight / scale

				const canvas = document.createElement('canvas')
				canvas.width = targetWidth
				canvas.height = targetHeight

				const ctx = canvas.getContext('2d')
				if (!ctx) return reject(new Error('Canvas context unavailable'))

				ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)
				resolve(canvas.toDataURL('image/jpeg', quality))
			})
			.catch(reject)
	})

const loadImage = (file: File): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const img = new Image()
		const objectUrl = URL.createObjectURL(file)

		img.onload = () => {
			URL.revokeObjectURL(objectUrl)
			resolve(img)
		}
		img.onerror = () => {
			URL.revokeObjectURL(objectUrl)
			reject(new Error('Could not read image file'))
		}
		img.src = objectUrl
	})

export const base64Size = (dataUri: string): number => {
	const commaIndex = dataUri.indexOf(',')
	const base64 = commaIndex >= 0 ? dataUri.slice(commaIndex + 1) : dataUri
	return Math.ceil((base64.length * 3) / 4)
}
