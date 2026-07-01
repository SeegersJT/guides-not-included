import Link from '../link/Link.component'

function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<p className="font-display text-7xl font-bold text-primary text-glow-teal">404</p>
				<h2 className="mt-4 text-xl font-semibold text-foreground">
					Page lost in the void
				</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					This colony tile doesn't exist or was dug out. Let's get you back to breathable
					air.
				</p>
				<div className="mt-6">
					<Link to="/" type="button" variant="default" text="Go Home" />
				</div>
			</div>
		</div>
	)
}

export default NotFound
