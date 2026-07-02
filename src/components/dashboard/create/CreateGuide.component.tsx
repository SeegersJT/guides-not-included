import GuideEditorContainer from '@/containers/dashboard/edit/EditGuide.container'

function CreatedGuide() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-10">
			<div className="mb-8">
				<h1 className="font-display text-3xl font-bold">Write a guide</h1>
				<p className="mt-1 text-muted-foreground">
					Share a build or system. Add screenshots and link related guides.
				</p>
			</div>
			<GuideEditorContainer />
		</div>
	)
}

export default CreatedGuide
