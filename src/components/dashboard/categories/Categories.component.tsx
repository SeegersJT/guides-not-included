import { useState } from 'react'
import { Plus, FolderPlus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
} from '@/components/ui/alert-dialog'

interface ColorChoice {
	label: string
	value: string
}

interface CategoriesProps {
	categories: ManagedCategory[]
	colorChoices: ColorChoice[]
	onAddCategory: (name: string, color: string) => void
	onRenameCategory: (id: string, name: string) => void
	onRecolorCategory: (id: string, color: string) => void
	onDeleteCategory: (id: string) => void
	onAddSubcategory: (catId: string, name: string) => boolean
	onRenameSubcategory: (catId: string, subId: string, name: string) => void
	onDeleteSubcategory: (catId: string, subId: string) => void
	onReset: () => void
}

function Categories({
	categories,
	colorChoices,
	onAddCategory,
	onRenameCategory,
	onRecolorCategory,
	onDeleteCategory,
	onAddSubcategory,
	onRenameSubcategory,
	onDeleteSubcategory,
	onReset,
}: CategoriesProps) {
	const [newCatName, setNewCatName] = useState('')
	const [newCatColor, setNewCatColor] = useState(colorChoices[0].value)

	const handleAdd = () => {
		if (!newCatName.trim()) return
		onAddCategory(newCatName, newCatColor)
		setNewCatName('')
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10">
			<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-3xl font-bold">Manage Categories</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Insert, update, and delete categories and their subcategories.
					</p>
				</div>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline" size="sm">
							<RotateCcw className="size-4" /> Reset to defaults
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Reset all categories?</AlertDialogTitle>
							<AlertDialogDescription>
								This restores the original seed categories and discards your local
								changes.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={onReset}>Reset</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<Card className="mb-8">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2 text-sm font-semibold">
						<FolderPlus className="size-4 text-primary" /> New category
					</div>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex flex-col gap-3 sm:flex-row">
						<Input
							value={newCatName}
							onChange={e => setNewCatName(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleAdd()}
							placeholder="Category name (e.g. Life Support)"
							className="flex-1"
						/>
						<Button onClick={handleAdd} disabled={!newCatName.trim()}>
							<Plus className="size-4" /> Add category
						</Button>
					</div>
					<ColorSwatches
						choices={colorChoices}
						value={newCatColor}
						onChange={setNewCatColor}
					/>
				</CardContent>
			</Card>

			{categories.length === 0 ? (
				<p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
					No categories yet. Add one above to get started.
				</p>
			) : (
				<div className="space-y-4">
					{categories.map(cat => (
						<CategoryRow
							key={cat.id}
							category={cat}
							colorChoices={colorChoices}
							onRename={name => onRenameCategory(cat.id, name)}
							onRecolor={color => onRecolorCategory(cat.id, color)}
							onDelete={() => onDeleteCategory(cat.id)}
							onAddSub={name => onAddSubcategory(cat.id, name)}
							onRenameSub={(subId, name) => onRenameSubcategory(cat.id, subId, name)}
							onDeleteSub={subId => onDeleteSubcategory(cat.id, subId)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default Categories
