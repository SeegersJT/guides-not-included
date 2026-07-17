import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { addSystemNotification } from '@/redux/actions/Notification.action'
import {
	requestCategoryData,
	requestAddCategory,
	requestUpdateCategory,
	requestDeleteCategory,
	requestAddSubcategory,
	requestUpdateSubcategory,
	requestDeleteSubcategory,
} from '@/redux/actions/Category.action'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Plus, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ColorSwatch from '@/components/color-swatch/ColorSwatch.component'
import CategoryRow from '@/components/category-row/CategoryRow.component'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CATEGORY_COLOR_CHOICES } from './Category.helper'
import type { CategoryItem } from '@/redux/types/Category.type'

function CategoryContainer() {
	const dispatch = useAppDispatch()

	const { categoryData, categoryDataLoading, categoryMutationLoading } = useSelector(
		(state: RootState) => state.system.category
	)

	const [newCategroyName, setNewCatategoryName] = useState('')
	const [newCatColor, setNewCatColor] = useState(CATEGORY_COLOR_CHOICES[0].value)

	useEffect(() => {
		dispatch(requestCategoryData())
	}, [dispatch])

	const addCategory = () => {
		const name = newCategroyName.trim()

		if (!name) return

		if (categoryData.some(category => category.name.toLowerCase() === name.toLowerCase())) {
			dispatch(
				addSystemNotification({
					type: 'error',
					title: 'Category',
					message: 'That category already exists.',
				})
			)

			return
		}

		dispatch(
			requestAddCategory({
				name,
				color: newCatColor,
				order: categoryData.length,
				subcategories: [],
			})
		)

		setNewCatategoryName('')
	}

	const handleRenameCategory = (categoryId: string, name: string) => {
		dispatch(requestUpdateCategory(categoryId, { name }))
	}

	const handleRecolorCategory = (categoryId: string, color: string) => {
		dispatch(requestUpdateCategory(categoryId, { color }))
	}

	const handleDeleteCategory = (categoryId: string) => {
		dispatch(requestDeleteCategory(categoryId))
	}

	const handleAddSubcategory = (category: CategoryItem, name: string): boolean => {
		const clean = name.trim()

		if (!clean) return false

		const isDuplicate = category.subcategories.some(
			subcategory => subcategory.name.toLowerCase() === clean.toLowerCase()
		)

		if (isDuplicate) {
			dispatch(
				addSystemNotification({
					type: 'error',
					title: 'Category',
					message: 'That subcategory already exists here.',
				})
			)
			return false
		}

		dispatch(
			requestAddSubcategory(category.id, {
				name: clean,
				order: category.subcategories.length,
			})
		)

		return true
	}

	const handleRenameSubcategory = (categoryId: string, subcategoryId: string, name: string) => {
		dispatch(requestUpdateSubcategory(categoryId, subcategoryId, { name }))
	}

	const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
		dispatch(requestDeleteSubcategory(categoryId, subcategoryId))
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
							value={newCategroyName}
							onChange={e => setNewCatategoryName(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && addCategory()}
							placeholder="Category name (e.g. Life Support)"
							className="flex-1"
						/>
						<Button
							onClick={addCategory}
							disabled={!newCategroyName.trim() || categoryMutationLoading}
						>
							<Plus className="size-4" /> Add category
						</Button>
					</div>
					<ColorSwatch value={newCatColor} onChange={setNewCatColor} />
				</CardContent>
			</Card>

			{categoryDataLoading ? (
				<p className="py-12 text-center text-sm text-muted-foreground">
					Loading categories…
				</p>
			) : categoryData.length === 0 ? (
				<p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
					No categories yet. Add one above to get started.
				</p>
			) : (
				<div className="space-y-4">
					{categoryData.map(category => (
						<CategoryRow
							key={category.id}
							category={category}
							categoryMutationLoading={categoryMutationLoading}
							onRename={name => handleRenameCategory(category.id, name)}
							onRecolor={color => handleRecolorCategory(category.id, color)}
							onDelete={() => handleDeleteCategory(category.id)}
							onAddSub={name => handleAddSubcategory(category, name)}
							onRenameSub={(subId, name) =>
								handleRenameSubcategory(category.id, subId, name)
							}
							onDeleteSub={subId => handleDeleteSubcategory(category.id, subId)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default CategoryContainer
