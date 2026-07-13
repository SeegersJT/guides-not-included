import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { RootState } from '@/redux/types/Root.type'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
	clearActiveGuide,
	requestDeleteGuide,
	requestGuideById,
	requestGuideList,
} from '@/redux/actions/Guide.action'
import { authService } from '@/firebase'
import Guide from '@/components/dashboard/guide/Guide.component'
import GuideNotFound from '@/components/guide-not-found/GuideNotFound.component'

function GuideContainer() {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const { id } = useParams<{ id: string }>()

	const { activeGuide, activeGuideLoading, guideList, guideMutationLoading } = useAppSelector(
		(state: RootState) => state.guide
	)

	useEffect(() => {
		if (!id) return

		dispatch(requestGuideById(id))

		return () => {
			dispatch(clearActiveGuide())
		}
	}, [dispatch, id])

	useEffect(() => {
		if (guideList.length === 0) {
			dispatch(requestGuideList({ status: 'published' }))
		}
	}, [dispatch, guideList.length])

	if (!id) return null

	if (activeGuideLoading) {
		return (
			<div className="mx-auto max-w-3xl animate-pulse px-4 py-8">
				<div className="h-8 w-2/3 rounded bg-card" />
				<div className="mt-6 aspect-video w-full rounded-xl bg-card" />
			</div>
		)
	}

	if (!activeGuide) {
		return <GuideNotFound />
	}

	const currentUser = authService.getCurrentUser()
	const isOwner = currentUser?.uid === activeGuide.authorId

	const linkedGuides = activeGuide.linkedGuideIds
		.map(linkedId => guideList.find(g => g.id === linkedId))
		.filter((g): g is NonNullable<typeof g> => Boolean(g))

	const handleDelete = () => {
		dispatch(requestDeleteGuide(activeGuide.id, () => navigate('/guides')))
	}

	return (
		<Guide
			guide={activeGuide}
			isOwner={isOwner}
			linkedGuides={linkedGuides}
			deleting={guideMutationLoading}
			onDelete={handleDelete}
		/>
	)
}

export default GuideContainer
