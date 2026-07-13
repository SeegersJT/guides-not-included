import { Link2 } from 'lucide-react'
import type { GuideBlock } from '@/redux/types/Guide.type'
import { Utils } from '@/utils/Utils'

interface GuideBlocksViewProps {
	blocks: GuideBlock[]
}

function GuideBlocksView({ blocks }: GuideBlocksViewProps) {
	return (
		<div className="mt-8 space-y-6">
			{blocks.map(block => {
				switch (block.type) {
					case 'heading':
						return (
							<h2 key={block.id} className="font-display text-xl font-bold">
								{block.text}
							</h2>
						)

					case 'text':
						return (
							<p
								key={block.id}
								className="whitespace-pre-wrap leading-relaxed text-foreground/90"
							>
								{block.text}
							</p>
						)

					case 'image':
						return (
							<figure
								key={block.id}
								className="overflow-hidden rounded-xl border border-border"
							>
								{block.src && (
									<img
										src={block.src}
										alt={block.caption ?? ''}
										className="w-full"
									/>
								)}
								{block.caption && (
									<figcaption className="bg-card px-4 py-2 text-sm text-muted-foreground">
										{block.caption}
									</figcaption>
								)}
							</figure>
						)

					case 'youtube': {
						const youtubeId = Utils.getYoutubeId(block.url)
						return (
							<figure
								key={block.id}
								className="overflow-hidden rounded-xl border border-border"
							>
								{youtubeId ? (
									<div className="aspect-video">
										<iframe
											src={`https://www.youtube.com/embed/${youtubeId}`}
											title={block.caption || 'Embedded video'}
											className="size-full"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									</div>
								) : (
									<div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
										Invalid YouTube link
									</div>
								)}
								{block.caption && (
									<figcaption className="bg-card px-4 py-2 text-sm text-muted-foreground">
										{block.caption}
									</figcaption>
								)}
							</figure>
						)
					}

					case 'mentions':
						return (
							<div
								key={block.id}
								className="rounded-xl border border-border bg-card/60 p-5"
							>
								<h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
									<Link2 className="size-4 text-primary" /> {block.heading}
								</h3>
								<ul className="space-y-2">
									{block.entries.map(entry => (
										<li key={entry.id} className="text-sm">
											{entry.url ? (
												<a
													href={entry.url}
													target="_blank"
													rel="noreferrer"
													className="font-medium text-primary hover:underline"
												>
													{entry.name}
												</a>
											) : (
												<span className="font-medium">{entry.name}</span>
											)}
											{entry.note && (
												<span className="text-muted-foreground">
													{' '}
													— {entry.note}
												</span>
											)}
										</li>
									))}
								</ul>
							</div>
						)

					default:
						return null
				}
			})}
		</div>
	)
}

export default GuideBlocksView
