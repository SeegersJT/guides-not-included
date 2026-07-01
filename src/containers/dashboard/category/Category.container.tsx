// containers/category/Category.container.tsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Plus, Trash2, Pencil, Check, X, FolderPlus, Tag } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { RootState, AppDispatch } from '@/redux/store'
import type { CategoryItem } from '@/redux/types/Category.type'
import {
	requestCategoryData,
	requestAddCategory,
	requestUpdateCategory,
	requestDeleteCategory,
	requestAddSubcategory,
	requestUpdateSubcategory,
	requestDeleteSubcategory,
} from '@/redux/actions/Category.action'

const CATEGORY_COLOR_CHOICES = [
	{ label: 'Teal', value: '#2dd4bf' },
	{ label: 'Amber', value: '#f59e0b' },
	{ label: 'Rose', value: '#f43f5e' },
	{ label: 'Violet', value: '#8b5cf6' },
	{ label: 'Sky', value: '#0ea5e9' },
	{ label: 'Lime', value: '#84cc16' },
]

function CategoryContainer() {
	const dispatch = useDispatch<AppDispatch>()
	const categories = useSelector((s: RootState) => s.category.categoryData)
	const listLoading = useSelector((s: RootState) => s.category.categoryDataLoading)
	const mutationLoading = useSelector((s: RootState) => s.category.categoryMutationLoading)

	const [newCatName, setNewCatName] = useState('')
	const [newCatColor, setNewCatColor] = useState(CATEGORY_COLOR_CHOICES[0].value)

	useEffect(() => {
		dispatch(requestCategoryData())
	}, [dispatch])

	const addCategory = () => {
		const name = newCatName.trim()
		if (!name) return
		if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
			toast.error('That category already exists.')
			return
		}
		dispatch(
			requestAddCategory({
				name,
				color: newCatColor,
				order: categories.length,
				subcategories: [],
			})
		)
		setNewCatName('')
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10">
			<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-3xl font-bold">Manage Categories</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Insert, update, and delete guide categories and subcategories.
					</p>
				</div>
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
							onKeyDown={e => e.key === 'Enter' && addCategory()}
							placeholder="Category name (e.g. Life Support)"
							className="flex-1"
						/>
						<Button
							onClick={addCategory}
							disabled={!newCatName.trim() || mutationLoading}
						>
							<Plus className="size-4" /> Add category
						</Button>
					</div>
					<ColorSwatches value={newCatColor} onChange={setNewCatColor} />
				</CardContent>
			</Card>

			{listLoading ? (
				<p className="py-12 text-center text-sm text-muted-foreground">
					Loading categories…
				</p>
			) : categories.length === 0 ? (
				<p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
					No categories yet. Add one above to get started.
				</p>
			) : (
				<div className="space-y-4">
					{categories.map(cat => (
						<CategoryRow
							key={cat.id}
							category={cat}
							mutationLoading={mutationLoading}
							onRename={name => dispatch(requestUpdateCategory(cat.id, { name }))}
							onRecolor={color => dispatch(requestUpdateCategory(cat.id, { color }))}
							onDelete={() => dispatch(requestDeleteCategory(cat.id))}
							onAddSub={name => {
								const clean = name.trim()
								if (!clean) return false
								if (
									cat.subcategories.some(
										s => s.name.toLowerCase() === clean.toLowerCase()
									)
								) {
									toast.error('That subcategory already exists here.')
									return false
								}
								dispatch(
									requestAddSubcategory(cat.id, {
										name: clean,
										icon: '',
										order: cat.subcategories.length,
									})
								)
								return true
							}}
							onRenameSub={(subId, name) =>
								dispatch(requestUpdateSubcategory(cat.id, subId, { name }))
							}
							onDeleteSub={subId => dispatch(requestDeleteSubcategory(cat.id, subId))}
						/>
					))}
				</div>
			)}
		</div>
	)
}

function ColorSwatches({ value, onChange }: { value: string; onChange: (color: string) => void }) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{CATEGORY_COLOR_CHOICES.map(c => (
				<button
					key={c.value}
					type="button"
					onClick={() => onChange(c.value)}
					title={c.label}
					aria-label={c.label}
					className={cn(
						'size-6 rounded-full border transition-transform hover:scale-110',
						value === c.value ? 'border-foreground ring-2 ring-ring' : 'border-border'
					)}
					style={{ backgroundColor: c.value }}
				/>
			))}
		</div>
	)
}

interface CategoryRowProps {
	category: CategoryItem
	mutationLoading: boolean
	onRename: (name: string) => void
	onRecolor: (color: string) => void
	onDelete: () => void
	onAddSub: (name: string) => boolean
	onRenameSub: (subId: string, name: string) => void
	onDeleteSub: (subId: string) => void
}

function CategoryRow({
	category,
	mutationLoading,
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
									disabled={mutationLoading}
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
											disabled={mutationLoading}
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
						<ColorSwatches value={category.color} onChange={onRecolor} />
					</div>
				)}
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-2">
					{category.subcategories.length === 0 ? (
						<p className="text-sm text-muted-foreground">No subcategories yet.</p>
					) : (
						category.subcategories.map(sub => (
							<SubcategoryChip
								key={sub.id}
								name={sub.name}
								color={category.color}
								onRename={name => onRenameSub(sub.id, name)}
								onDelete={() => onDeleteSub(sub.id)}
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
						disabled={!newSub.trim() || mutationLoading}
					>
						<Plus className="size-4" /> Add
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

function SubcategoryChip({
	name,
	color,
	onRename,
	onDelete,
}: {
	name: string
	color: string
	onRename: (name: string) => void
	onDelete: () => void
}) {
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

export default CategoryContainer
