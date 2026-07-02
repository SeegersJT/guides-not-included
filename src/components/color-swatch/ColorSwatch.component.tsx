import { CATEGORY_COLOR_CHOICES } from '@/containers/dashboard/category/Category.helper'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
	value: string
	onChange: (color: string) => void
}

function ColorSwatch({ value, onChange }: ColorSwatchProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{CATEGORY_COLOR_CHOICES.map(choice => (
				<button
					key={choice.value}
					type="button"
					onClick={() => onChange(choice.value)}
					title={choice.label}
					aria-label={choice.label}
					className={cn(
						'size-6 rounded-full border transition-transform hover:scale-110',
						value === choice.value
							? 'border-foreground ring-2 ring-ring'
							: 'border-border'
					)}
					style={{ backgroundColor: choice.value }}
				/>
			))}
		</div>
	)
}

export default ColorSwatch
