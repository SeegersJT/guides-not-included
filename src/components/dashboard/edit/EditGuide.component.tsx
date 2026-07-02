import type { ChangeEvent } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { CategoryItem } from '@/redux/types/Category.type'
import type { GuideBlock, GuideItem } from '@/redux/types/Guide.type'
import BlockEditor from './block-editor/BlockEditor.component'

interface GuideEditorProps {
	title: string
	onTitleChange: (value: string) => void
	summary: string
	onSummaryChange: (value: string) => void
	categories: CategoryItem[]
	categoryId: string
	onCategoryChange: (id: string) => void
	subcategoryId: string
	onSubcategoryChange: (id: string) => void
	blocks: GuideBlock[]
	onBlocksChange: (blocks: GuideBlock[]) => void
	onSelectBlockImage: (blockId: string, file: File) => void
	coverImage: string | null
	onCoverSelect: (file: File) => void
	onCoverRemove: () => void
	linkedGuideIds: string[]
	linkOptions: GuideItem[]
	linkSearch: string
	onLinkSearchChange: (value: string) => void
	onToggleLinkedGuide: (id: string) => void
	saving: boolean
	isEditing: boolean
	onSubmit: () => void
	onCancel: () => void
}

function GuideEditor({
	title,
	onTitleChange,
	summary,
	onSummaryChange,
	categories,
	categoryId,
	onCategoryChange,
	subcategoryId,
	onSubcategoryChange,
	blocks,
	onBlocksChange,
	onSelectBlockImage,
	coverImage,
	onCoverSelect,
	onCoverRemove,
	linkedGuideIds,
	linkOptions,
	linkSearch,
	onLinkSearchChange,
	onToggleLinkedGuide,
	saving,
	isEditing,
	onSubmit,
	onCancel,
}: GuideEditorProps) {
	const activeCategory = categories.find(c => c.id === categoryId)

	const handleCoverInput = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) onCoverSelect(file)
		e.target.value = ''
	}

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				onSubmit()
			}}
			className="space-y-8"
		>
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={title}
							onChange={e => onTitleChange(e.target.value)}
							placeholder="e.g. Self-cooling SPOM that never overheats"
							maxLength={120}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="summary">Short summary</Label>
						<Input
							id="summary"
							value={summary}
							onChange={e => onSummaryChange(e.target.value)}
							placeholder="One line shown on guide cards"
							maxLength={200}
						/>
					</div>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<Label>Category</Label>
						<Select value={categoryId} onValueChange={onCategoryChange}>
							<SelectTrigger>
								<SelectValue placeholder="Choose a category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map(c => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{activeCategory && activeCategory.subcategories.length > 0 && (
						<div className="space-y-2">
							<Label>Subcategory</Label>
							<Select value={subcategoryId} onValueChange={onSubcategoryChange}>
								<SelectTrigger>
									<SelectValue placeholder="Choose a subcategory" />
								</SelectTrigger>
								<SelectContent>
									{activeCategory.subcategories.map(s => (
										<SelectItem key={s.id} value={s.id}>
											{s.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="space-y-2">
						<Label>Cover image</Label>
						<label className="flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-card/50 p-4 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50">
							{coverImage ? (
								<img
									src={coverImage}
									alt="Cover preview"
									className="aspect-video w-full rounded-md object-cover"
								/>
							) : (
								<>
									<Upload className="size-6" />
									<span>Upload a cover screenshot</span>
								</>
							)}
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleCoverInput}
							/>
						</label>
						{coverImage && (
							<button
								type="button"
								onClick={onCoverRemove}
								className="text-xs text-destructive hover:underline"
							>
								Remove cover
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="space-y-3">
				<div>
					<Label className="text-base">Guide content</Label>
					<p className="text-sm text-muted-foreground">
						Build your guide one module at a time. Add text, screenshots, videos and
						credits — then reorder them however you like.
					</p>
				</div>
				<BlockEditor
					blocks={blocks}
					onChange={onBlocksChange}
					onSelectImage={onSelectBlockImage}
				/>
			</div>

			<div className="space-y-3">
				<Label className="text-base">Link related guides</Label>
				<p className="text-sm text-muted-foreground">
					Connect this guide to other builds so readers can follow along.
				</p>
				{linkedGuideIds.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{linkedGuideIds.map(id => {
							const guide = linkOptions.find(g => g.id === id)
							return (
								<span
									key={id}
									className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm text-primary"
								>
									{guide?.title ?? 'Guide'}
									<button
										type="button"
										onClick={() => onToggleLinkedGuide(id)}
										aria-label="Unlink"
									>
										<X className="size-3.5" />
									</button>
								</span>
							)
						})}
					</div>
				)}
				<Input
					value={linkSearch}
					onChange={e => onLinkSearchChange(e.target.value)}
					placeholder="Search guides to link..."
				/>
				{linkSearch && (
					<div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border bg-card p-2">
						{linkOptions.length === 0 ? (
							<p className="p-2 text-sm text-muted-foreground">No matching guides.</p>
						) : (
							linkOptions.slice(0, 20).map(g => (
								<button
									type="button"
									key={g.id}
									onClick={() => onToggleLinkedGuide(g.id)}
									className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
								>
									<span className="truncate">{g.title}</span>
									<span className="text-xs text-muted-foreground">
										{linkedGuideIds.includes(g.id) ? 'Linked ✓' : 'Link'}
									</span>
								</button>
							))
						)}
					</div>
				)}
			</div>

			<div className="flex items-center gap-3 border-t border-border pt-6">
				<Button type="submit" variant="default" size="lg" disabled={saving}>
					{saving && <Loader2 className="size-4 animate-spin" />}
					{isEditing ? 'Save changes' : 'Publish guide'}
				</Button>
				<Button type="button" variant="ghost" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	)
}

export default GuideEditor
