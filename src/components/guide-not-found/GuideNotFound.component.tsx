import Link from '@/components/link/Link.component'

function GuideNotFound() {
	return (
		<div className="mx-auto max-w-md px-4 py-24 text-center">
			<h1 className="font-display text-2xl font-bold">Guide not found</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				This guide may have been removed or the link is broken.
			</p>
			<div className="mt-6">
				<Link to="/guides" type="button" variant="default" text="Browse guides" />
			</div>
		</div>
	)
}

export default GuideNotFound
