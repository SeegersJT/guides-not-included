import { useRef, type ReactNode } from 'react'
import {
	ArrowDown,
	ArrowUp,
	Heading,
	ImagePlus,
	Plus,
	Link2,
	Trash2,
	Type,
	Users,
	X,
	MonitorPlay,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BLOCK_META, createBlock, getYoutubeId, newId } from '@/utils/guideBlocks'
import type { GuideBlock, GuideBlockType, MentionEntry } from '@/redux/types/Guide.type'

const TYPE_ICONS: Record<GuideBlockType, typeof Type> = {
	text: Type,
	heading: Heading,
	image: ImagePlus,
	youtube: MonitorPlay,
	mentions: Users,
}

const ADD_ORDER: GuideBlockType[] = ['text', 'heading', 'image', 'youtube', 'mentions']

interface BlockEditorProps {
	blocks: GuideBlock[]
	onChange: (blocks: GuideBlock[]) => void
	onSelectImage: (blockId: string, file: File) => void
}

export function BlockEditor({ blocks, onChange, onSelectImage }: BlockEditorProps) {
	const update = (id: string, patch: Partial<GuideBlock>) =>
		onChange(blocks.map(b => (b.id === id ? ({ ...b, ...patch } as GuideBlock) : b)))

	const remove = (id: string) => onChange(blocks.filter(b => b.id !== id))

	const move = (index: number, dir: -1 | 1) => {
		const target = index + dir
		if (target < 0 || target >= blocks.length) return
		const next = [...blocks]
		;[next[index], next[target]] = [next[target], next[index]]
		onChange(next)
	}

	const addBlock = (type: GuideBlockType, atIndex?: number) => {
		const block = createBlock(type)
		if (atIndex === undefined) {
			onChange([...blocks, block])
		} else {
			const next = [...blocks]
			next.splice(atIndex, 0, block)
			onChange(next)
		}
	}

	return (
		<div className="space-y-4">
			{blocks.length === 0 ? (
				<EmptyAddCard onAdd={t => addBlock(t)} />
			) : (
				<>
					{blocks.map((block, idx) => (
						<BlockCard
							key={block.id}
							block={block}
							index={idx}
							total={blocks.length}
							onMove={move}
							onRemove={remove}
							onUpdate={update}
							onSelectImage={onSelectImage}
						/>
					))}
					<AddModuleBar onAdd={t => addBlock(t)} />
				</>
			)}
		</div>
	)
}

function EmptyAddCard({ onAdd }: { onAdd: (t: GuideBlockType) => void }) {
	return (
		<div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
			<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
				<Plus className="size-6" />
			</div>
			<p className="mt-3 font-display text-lg font-semibold">Start your guide</p>
			<p className="mt-1 text-sm text-muted-foreground">
				Add modules one at a time — text, screenshots, videos and more.
			</p>
			<div className="mt-5 flex flex-wrap justify-center gap-2">
				{ADD_ORDER.map(type => {
					const Icon = TYPE_ICONS[type]
					return (
						<Button
							key={type}
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onAdd(type)}
						>
							<Icon className="size-4" /> {BLOCK_META[type].label}
						</Button>
					)
				})}
			</div>
		</div>
	)
}

function AddModuleBar({ onAdd }: { onAdd: (t: GuideBlockType) => void }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/30 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
				>
					<Plus className="size-4 transition-transform group-hover:rotate-90" />
					Add module
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-64">
				{ADD_ORDER.map(type => {
					const Icon = TYPE_ICONS[type]
					return (
						<DropdownMenuItem
							key={type}
							onClick={() => onAdd(type)}
							className="gap-3 py-2.5"
						>
							<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
								<Icon className="size-4" />
							</span>
							<span className="flex flex-col">
								<span className="font-medium">{BLOCK_META[type].label}</span>
								<span className="text-xs text-muted-foreground">
									{BLOCK_META[type].description}
								</span>
							</span>
						</DropdownMenuItem>
					)
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function BlockCard({
	block,
	index,
	total,
	onMove,
	onRemove,
	onUpdate,
	onSelectImage,
}: {
	block: GuideBlock
	index: number
	total: number
	onMove: (index: number, dir: -1 | 1) => void
	onRemove: (id: string) => void
	onUpdate: (id: string, patch: Partial<GuideBlock>) => void
	onSelectImage: (blockId: string, file: File) => void
}) {
	const Icon = TYPE_ICONS[block.type]
	return (
		<div className="rounded-xl border border-border bg-card p-4 panel">
			<div className="mb-3 flex items-center justify-between">
				<span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
					<Icon className="size-4 text-primary" />
					{BLOCK_META[block.type].label}
				</span>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => onMove(index, -1)}
						disabled={index === 0}
						className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
						aria-label="Move up"
					>
						<ArrowUp className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => onMove(index, 1)}
						disabled={index === total - 1}
						className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
						aria-label="Move down"
					>
						<ArrowDown className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => onRemove(block.id)}
						className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
						aria-label="Remove module"
					>
						<Trash2 className="size-4" />
					</button>
				</div>
			</div>

			<BlockBody block={block} onUpdate={onUpdate} onSelectImage={onSelectImage} />
		</div>
	)
}

function BlockBody({
	block,
	onUpdate,
	onSelectImage,
}: {
	block: GuideBlock
	onUpdate: (id: string, patch: Partial<GuideBlock>) => void
	onSelectImage: (blockId: string, file: File) => void
}) {
	switch (block.type) {
		case 'heading':
			return (
				<Input
					value={block.text}
					onChange={e => onUpdate(block.id, { text: e.target.value })}
					placeholder="Step 1 — Build the chamber"
					className="font-display text-lg font-bold"
					maxLength={120}
				/>
			)
		case 'text':
			return <RichTextField block={block} onUpdate={onUpdate} />
		case 'image':
			return <ImageField block={block} onUpdate={onUpdate} onSelectImage={onSelectImage} />
		case 'youtube':
			return <YoutubeField block={block} onUpdate={onUpdate} />
		case 'mentions':
			return <MentionsField block={block} onUpdate={onUpdate} />
		default:
			return null
	}
}

function RichTextField({
	block,
	onUpdate,
}: {
	block: Extract<GuideBlock, { type: 'text' }>
	onUpdate: (id: string, patch: Partial<GuideBlock>) => void
}) {
	const ref = useRef<HTMLTextAreaElement>(null)

	const wrap = (before: string, after = before) => {
		const el = ref.current
		if (!el) return
		const { selectionStart: s, selectionEnd: e, value } = el
		const selected = value.slice(s, e) || 'text'
		const next = value.slice(0, s) + before + selected + after + value.slice(e)
		onUpdate(block.id, { text: next })
		requestAnimationFrame(() => {
			el.focus()
			el.setSelectionRange(s + before.length, s + before.length + selected.length)
		})
	}

	const prefixLines = (prefix: string) => {
		const el = ref.current
		if (!el) return
		const { selectionStart: s, value } = el
		const lineStart = value.lastIndexOf('\n', s - 1) + 1
		const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
		onUpdate(block.id, { text: next })
		requestAnimationFrame(() => el.focus())
	}

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-1">
				<ToolbarButton label="Bold" onClick={() => wrap('**')}>
					<span className="font-bold">B</span>
				</ToolbarButton>
				<ToolbarButton label="Italic" onClick={() => wrap('*')}>
					<span className="italic">I</span>
				</ToolbarButton>
				<ToolbarButton label="Inline code" onClick={() => wrap('`')}>
					<span className="font-mono text-xs">{'</>'}</span>
				</ToolbarButton>
				<ToolbarButton label="Bullet list" onClick={() => prefixLines('- ')}>
					<span className="text-xs">• List</span>
				</ToolbarButton>
				<ToolbarButton label="Link" onClick={() => wrap('[', '](https://)')}>
					<Link2 className="size-3.5" />
				</ToolbarButton>
			</div>
			<Textarea
				ref={ref}
				value={block.text}
				onChange={e => onUpdate(block.id, { text: e.target.value })}
				placeholder="Write your explanation. Use the buttons above for **bold**, *italic*, lists and links."
				className="min-h-40"
			/>
			<p className="text-xs text-muted-foreground">
				Tip: leave a blank line between paragraphs.
			</p>
		</div>
	)
}

function ToolbarButton({
	label,
	onClick,
	children,
}: {
	label: string
	onClick: () => void
	children: ReactNode
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			title={label}
			className="flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-background px-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
		>
			{children}
		</button>
	)
}

function ImageField({
	block,
	onUpdate,
	onSelectImage,
}: {
	block: Extract<GuideBlock, { type: 'image' }>
	onUpdate: (id: string, patch: Partial<GuideBlock>) => void
	onSelectImage: (blockId: string, file: File) => void
}) {
	return (
		<div className="space-y-3">
			<label className="flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-card/50 p-3 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50">
				{block.src ? (
					<img
						src={block.src}
						alt="Preview"
						className="max-h-72 w-full rounded-md object-contain"
					/>
				) : (
					<span className="flex flex-col items-center gap-2 py-6">
						<ImagePlus className="size-7" />
						Upload a screenshot
					</span>
				)}
				<input
					type="file"
					accept="image/*"
					className="hidden"
					onChange={e => {
						const file = e.target.files?.[0]
						if (file) onSelectImage(block.id, file)
						e.target.value = ''
					}}
				/>
			</label>
			<Input
				value={block.caption}
				onChange={e => onUpdate(block.id, { caption: e.target.value })}
				placeholder="Caption (optional)"
				maxLength={200}
			/>
		</div>
	)
}

function YoutubeField({
	block,
	onUpdate,
}: {
	block: Extract<GuideBlock, { type: 'youtube' }>
	onUpdate: (id: string, patch: Partial<GuideBlock>) => void
}) {
	const videoId = getYoutubeId(block.url)
	return (
		<div className="space-y-3">
			<Input
				value={block.url}
				onChange={e => onUpdate(block.id, { url: e.target.value })}
				placeholder="Paste a YouTube link (https://youtu.be/...)"
			/>
			{block.url && !videoId && (
				<p className="text-xs text-destructive">
					That doesn't look like a valid YouTube link yet.
				</p>
			)}
			{videoId && (
				<div className="aspect-video overflow-hidden rounded-lg border border-border">
					<iframe
						src={`https://www.youtube.com/embed/${videoId}`}
						title="YouTube preview"
						allowFullScreen
						className="h-full w-full"
					/>
				</div>
			)}
			<Input
				value={block.caption}
				onChange={e => onUpdate(block.id, { caption: e.target.value })}
				placeholder="Caption (optional)"
				maxLength={200}
			/>
		</div>
	)
}

function MentionsField({
	block,
	onUpdate,
}: {
	block: Extract<GuideBlock, { type: 'mentions' }>
	onUpdate: (id: string, patch: Partial<GuideBlock>) => void
}) {
	const setEntries = (entries: MentionEntry[]) => onUpdate(block.id, { entries })

	const updateEntry = (id: string, patch: Partial<MentionEntry>) =>
		setEntries(block.entries.map(e => (e.id === id ? { ...e, ...patch } : e)))

	const addEntry = () =>
		setEntries([...block.entries, { id: newId(), name: '', url: '', note: '' }])

	const removeEntry = (id: string) => setEntries(block.entries.filter(e => e.id !== id))

	return (
		<div className="space-y-3">
			<div className="space-y-1.5">
				<Label className="text-xs text-muted-foreground">Section title</Label>
				<Input
					value={block.heading}
					onChange={e => onUpdate(block.id, { heading: e.target.value })}
					placeholder="Credits & references"
					maxLength={80}
				/>
			</div>
			<p className="text-xs text-muted-foreground">
				Recognise builders you referenced. Link a profile here with{' '}
				<code className="rounded bg-secondary px-1">/u/username</code> or paste an external
				link.
			</p>
			<div className="space-y-3">
				{block.entries.map(entry => (
					<div
						key={entry.id}
						className="space-y-2 rounded-lg border border-border bg-background p-3"
					>
						<div className="flex items-center gap-2">
							<Input
								value={entry.name}
								onChange={e => updateEntry(entry.id, { name: e.target.value })}
								placeholder="Name or handle"
								maxLength={60}
							/>
							<button
								type="button"
								onClick={() => removeEntry(entry.id)}
								className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-destructive"
								aria-label="Remove mention"
							>
								<X className="size-4" />
							</button>
						</div>
						<Input
							value={entry.url}
							onChange={e => updateEntry(entry.id, { url: e.target.value })}
							placeholder="/u/username or https://..."
						/>
						<Input
							value={entry.note}
							onChange={e => updateEntry(entry.id, { note: e.target.value })}
							placeholder="What did they help with? (optional)"
							maxLength={140}
						/>
					</div>
				))}
			</div>
			<Button type="button" variant="outline" size="sm" onClick={addEntry}>
				<Plus className="size-4" /> Add person
			</Button>
		</div>
	)
}

export default BlockEditor
