import type { CategoryItem } from '@/redux/types/Category.type'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog'
import SubcategoryChip from '../sub-category-chip/SubCategoryChip.component'
import ColorSwatch from '../color-swatch/ColorSwatch.component'

interface CategoryRowProps {
	category: CategoryItem
	categoryMutationLoading: boolean
	onRename: (name: string) => void
	onRecolor: (color: string) => void
	onDelete: () => void
	onAddSub: (name: string) => boolean
	onRenameSub: (subId: string, name: string) => void
	onDeleteSub: (subId: string) => void
}

function CategoryRow({
	category,
	categoryMutationLoading,
	onRename,
	onRecolor,
	onDelete,
	onAddSub,
	onRenameSub,
	onDeleteSub,
}: CategoryRowProps) {
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState(category.name)
	const [newSub, setNewSub] = useState('')

	const saveName = () => {
		const clean = draft.trim()
		if (clean) onRename(clean)
		else setDraft(category.name)
		setEditing(false)
	}

	const handleAddSub = () => {
		if (onAddSub(newSub)) setNewSub('')
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<span
						className="size-3.5 shrink-0 rounded-full"
						style={{ backgroundColor: category.color }}
					/>
					{editing ? (
						<>
							<Input
								autoFocus
								value={draft}
								onChange={e => setDraft(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') saveName()
									if (e.key === 'Escape') {
										setDraft(category.name)
										setEditing(false)
									}
								}}
								className="h-8 max-w-xs"
							/>
							<Button
								size="icon"
								variant="ghost"
								className="size-8"
								onClick={saveName}
							>
								<Check className="size-4" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="size-8"
								onClick={() => {
									setDraft(category.name)
									setEditing(false)
								}}
							>
								<X className="size-4" />
							</Button>
						</>
					) : (
						<>
							<h2 className="text-lg font-semibold">{category.name}</h2>
							<span className="text-xs text-muted-foreground">
								{category.subcategories.length} sub
								{category.subcategories.length === 1 ? '' : 's'}
							</span>
							<div className="ml-auto flex items-center gap-1">
								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									disabled={categoryMutationLoading}
									onClick={() => {
										setDraft(category.name)
										setEditing(true)
									}}
								>
									<Pencil className="size-4" />
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="size-8 text-destructive hover:text-destructive"
											disabled={categoryMutationLoading}
										>
											<Trash2 className="size-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Delete "{category.name}"?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This removes the category and its{' '}
												{category.subcategories.length} subcategor
												{category.subcategories.length === 1 ? 'y' : 'ies'}.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={onDelete}>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</>
					)}
				</div>

				{editing && (
					<div className="pt-2">
						<ColorSwatch value={category.color} onChange={onRecolor} />
					</div>
				)}
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-2">
					{category.subcategories.length === 0 ? (
						<p className="text-sm text-muted-foreground">No subcategories yet.</p>
					) : (
						category.subcategories.map(subcategory => (
							<SubcategoryChip
								key={subcategory.id}
								name={subcategory.name}
								color={category.color}
								onRename={name => onRenameSub(subcategory.id, name)}
								onDelete={() => onDeleteSub(subcategory.id)}
							/>
						))
					)}
				</div>
				<div className="flex gap-2">
					<Input
						value={newSub}
						onChange={e => setNewSub(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleAddSub()}
						placeholder="Add a subcategory..."
						className="h-8 max-w-xs"
					/>
					<Button
						size="sm"
						variant="secondary"
						onClick={handleAddSub}
						disabled={!newSub.trim() || categoryMutationLoading}
					>
						<Plus className="size-4" /> Add
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default CategoryRow
