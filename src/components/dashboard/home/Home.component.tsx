import HeroImage from '@/assets/hero-colony.png'
import GuideRow from '@/components/guide-row/GuideRow.component'
import Link from '@/components/link/Link.component'
import { HomeFeatureStrip } from '@/containers/dashboard/home/Home.helper'
import type { GuideItem } from '@/redux/types/Guide.type'
import { ArrowRight, Flame, Sparkles } from 'lucide-react'

interface HomeProps {
	mostLikedGuides: GuideItem[]
	mostLikedLoading: boolean
	recentGuides: GuideItem[]
	recentLoading: boolean
	subcategoryMeta: Map<string, { name: string; color: string }>
}

function Home({
	mostLikedGuides,
	mostLikedLoading,
	recentGuides,
	recentLoading,
	subcategoryMeta,
}: HomeProps) {
	return (
		<div>
			<section className="relative overflow-hidden border-b border-border">
				<img
					src={HeroImage}
					alt="Cross-section of an Oxygen Not Included asteroid colony"
					width={1920}
					height={1080}
					className="absolute inset-0 size-full object-cover object-top"
				/>
				<div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
				<div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
					<div className="max-w-2xl">
						<span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							<Sparkles className="size-3.5" /> Community guides &amp; base builds
						</span>
						<h1 className="mt-5 font-display text-4xl font-bold leading-tight text-foreground sm:text-6xl">
							Keep your colony{' '}
							<span className="text-primary text-glow-teal">breathing</span>.
						</h1>
						<p className="mt-4 max-w-xl text-lg text-muted-foreground">
							Guides Not Included is the place to write up your Oxygen Not Included
							builds with screenshots, link related guides together, and learn from
							other duplicants.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link to="/guides" type="button" variant="default">
								Browse guides <ArrowRight className="size-4 ml-5" />
							</Link>
							<Link to="/create" type="button" variant="ghost">
								Write a guide
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-4 sm:grid-cols-3">
					{HomeFeatureStrip.map(f => (
						<div
							key={f.title}
							className="rounded-xl border border-border bg-card p-5 panel"
						>
							<f.icon className="size-6 text-primary" />
							<h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
							<p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
						</div>
					))}
				</div>
			</section>

			<GuideRow
				title="Most liked"
				icon={<Flame className="size-5 text-accent" />}
				emptyText="No guides yet - be the first to publish one!"
				guides={mostLikedGuides}
				isLoading={mostLikedLoading}
				subcategoryMeta={subcategoryMeta}
			/>
			<GuideRow
				title="Freshly dug"
				icon={<Sparkles className="size-5 text-primary" />}
				emptyText="No guides yet - be the first to publish one!"
				guides={recentGuides}
				isLoading={recentLoading}
				subcategoryMeta={subcategoryMeta}
			/>
		</div>
	)
}

export default Home
