import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '@/redux/types/Root.type'
import { useAppSelector } from '@/hooks/useAppSelector'
import { requestAddGuide, requestUpdateGuide, requestGuideList } from '@/redux/actions/Guide.action'
import { addSystemNotification } from '@/redux/actions/Notification.action'
import type { GuideBlock, GuideEditorSubmission, GuideItem } from '@/redux/types/Guide.type'
import GuideEditor from '@/components/dashboard/edit/EditGuide.component'
import { base64Size, fileToCoverBase64 } from '@/utils/Image'
import { MAX_TOTAL_IMAGE_BYTES, totalImagePayloadSize } from '@/utils/GuideBlocks'
import { requestCategoryData } from '@/redux/actions/Category.action'

interface GuideEditorContainerProps {
	existing?: GuideItem
}

function GuideEditorContainer({ existing }: GuideEditorContainerProps) {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { categoryData } = useAppSelector((state: RootState) => state.system.category)
	const { guideList, guideMutationLoading } = useAppSelector((state: RootState) => state.guide)

	const [title, setTitle] = useState(existing?.title ?? '')
	const [summary, setSummary] = useState(existing?.summary ?? '')
	const [categoryId, setCategoryId] = useState(existing?.categoryId ?? '')
	const [subcategoryId, setSubcategoryId] = useState(existing?.subcategoryId ?? '')
	const [blocks, setBlocks] = useState<GuideBlock[]>(existing?.content ?? [])
	const [coverImage, setCoverImage] = useState<string | null>(existing?.coverImage ?? null)
	const [linkedGuideIds, setLinkedGuideIds] = useState<string[]>(existing?.linkedGuideIds ?? [])
	const [linkSearch, setLinkSearch] = useState('')

	useEffect(() => {
		dispatch(requestGuideList({ status: 'published' }))
		dispatch(requestCategoryData())
	}, [dispatch])

	const linkOptions = useMemo(
		() =>
			guideList
				.filter(g => g.id !== existing?.id)
				.filter(g => g.title.toLowerCase().includes(linkSearch.toLowerCase())),
		[guideList, linkSearch, existing?.id]
	)

	const notifyImageTooLarge = () => {
		dispatch(
			addSystemNotification({
				type: 'error',
				title: 'Guide',
				message:
					'This guide has too many or too-large images for one document. Remove an image or use a smaller screenshot.',
			})
		)
	}

	const notifyImageFailed = () => {
		dispatch(
			addSystemNotification({
				type: 'error',
				title: 'Guide',
				message: 'Could not process that image.',
			})
		)
	}

	const handleSelectBlockImage = async (blockId: string, file: File) => {
		try {
			const src = await fileToCoverBase64(file, 1000, 800, 1)
			const projectedTotal = totalImagePayloadSize(blocks, coverImage) + base64Size(src)

			if (projectedTotal > MAX_TOTAL_IMAGE_BYTES) {
				notifyImageTooLarge()
				return
			}

			setBlocks(prev =>
				prev.map(b => (b.id === blockId && b.type === 'image' ? { ...b, src } : b))
			)
		} catch {
			notifyImageFailed()
		}
	}

	const handleCoverSelect = async (file: File) => {
		try {
			const src = await fileToCoverBase64(file, 480, 400, 1)
			const projectedTotal = totalImagePayloadSize(blocks, null) + base64Size(src)

			if (projectedTotal > MAX_TOTAL_IMAGE_BYTES) {
				notifyImageTooLarge()
				return
			}

			setCoverImage(src)
		} catch {
			notifyImageFailed()
		}
	}

	const handleCoverRemove = () => setCoverImage(null)

	const handleToggleLinkedGuide = (id: string) => {
		setLinkedGuideIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
	}

	const handleCategoryChange = (id: string) => {
		setCategoryId(id)
		setSubcategoryId('')
	}

	const handleSubmit = () => {
		if (!title.trim()) {
			dispatch(
				addSystemNotification({
					type: 'error',
					title: 'Guide',
					message: 'Please add a title.',
				})
			)
			return
		}

		if (!categoryId) {
			dispatch(
				addSystemNotification({
					type: 'error',
					title: 'Guide',
					message: 'Please choose a category.',
				})
			)
			return
		}

		if (blocks.length === 0) {
			dispatch(
				addSystemNotification({
					type: 'error',
					title: 'Guide',
					message: 'Add at least one content module to your guide.',
				})
			)
			return
		}

		const submission: GuideEditorSubmission = {
			title: title.trim(),
			summary: summary.trim(),
			content: blocks,
			categoryId,
			subcategoryId: subcategoryId || undefined,
			coverImage,
			linkedGuideIds,
			tags: [],
			status: 'published',
		}

		if (existing) {
			dispatch(
				requestUpdateGuide(existing.id, submission, () =>
					navigate(`/guides/${existing.id}`)
				)
			)
		} else {
			dispatch(requestAddGuide(submission, id => navigate(`/guides/${id}`)))
		}
	}

	return (
		<GuideEditor
			title={title}
			onTitleChange={setTitle}
			summary={summary}
			onSummaryChange={setSummary}
			categories={categoryData}
			categoryId={categoryId}
			onCategoryChange={handleCategoryChange}
			subcategoryId={subcategoryId}
			onSubcategoryChange={setSubcategoryId}
			blocks={blocks}
			onBlocksChange={setBlocks}
			onSelectBlockImage={handleSelectBlockImage}
			coverImage={coverImage}
			onCoverSelect={handleCoverSelect}
			onCoverRemove={handleCoverRemove}
			linkedGuideIds={linkedGuideIds}
			linkOptions={linkOptions}
			linkSearch={linkSearch}
			onLinkSearchChange={setLinkSearch}
			onToggleLinkedGuide={handleToggleLinkedGuide}
			saving={guideMutationLoading}
			isEditing={Boolean(existing)}
			onSubmit={handleSubmit}
			onCancel={() => navigate(existing ? `/guides/${existing.id}` : '/guides')}
		/>
	)
}

export default GuideEditorContainer
