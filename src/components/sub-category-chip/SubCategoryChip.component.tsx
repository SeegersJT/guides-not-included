import { useState } from 'react'
import { Tag, Pencil, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SubcategoryChipProps {
	name: string
	color: string
	onRename: (name: string) => void
	onDelete: () => void
}

function SubcategoryChip({ name, color, onRename, onDelete }: SubcategoryChipProps) {
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState(name)

	const save = () => {
		const clean = draft.trim()
		if (clean) onRename(clean)
		else setDraft(name)
		setEditing(false)
	}

	if (editing) {
		return (
			<div className="flex items-center gap-1 rounded-full border border-border bg-secondary px-1 py-0.5">
				<Input
					autoFocus
					value={draft}
					onChange={e => setDraft(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') save()
						if (e.key === 'Escape') {
							setDraft(name)
							setEditing(false)
						}
					}}
					className="h-6 w-32 border-0 bg-transparent px-1 text-sm focus-visible:ring-0"
				/>
				<button onClick={save} className="rounded-full p-1 hover:bg-background">
					<Check className="size-3.5" />
				</button>
			</div>
		)
	}

	return (
		<span className="group flex items-center gap-1.5 rounded-full border border-border bg-secondary py-1 pl-2.5 pr-1.5 text-sm">
			<Tag className="size-3" style={{ color }} />
			{name}
			<button
				onClick={() => {
					setDraft(name)
					setEditing(true)
				}}
				className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
				aria-label="Rename subcategory"
			>
				<Pencil className="size-3" />
			</button>
			<button
				onClick={onDelete}
				className="rounded-full p-0.5 text-muted-foreground hover:text-destructive"
				aria-label="Delete subcategory"
			>
				<X className="size-3.5" />
			</button>
		</span>
	)
}

export default SubcategoryChip
