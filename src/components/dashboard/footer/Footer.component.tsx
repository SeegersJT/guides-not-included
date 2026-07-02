import MASCOT_ICON from '@/assets/mascot.png'

function Footer() {
	return (
		<footer className="mt-20 border-t border-border bg-card/40">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
				<div className="flex items-center gap-2.5">
					<img
						src={MASCOT_ICON}
						alt=""
						width={32}
						height={32}
						className="size-8 object-contain"
					/>
					<span className="font-display text-sm font-semibold">
						Guides <span className="text-primary">Not Included</span>
					</span>
				</div>
				<p className="text-center text-xs text-muted-foreground">
					A fan-made community guide hub for{' '}
					<a
						href="https://www.klei.com/"
						target="_blank"
						className="text-primary hover:underline"
					>
						Oxygen Not Included
					</a>
					. Not affiliated with Klei Entertainment.
				</p>
				<nav className="flex items-center gap-4 text-xs text-muted-foreground">
					<p>Created by PKSolo103 & HappyFeet @ 2026</p>
				</nav>
			</div>
		</footer>
	)
}

export default Footer
