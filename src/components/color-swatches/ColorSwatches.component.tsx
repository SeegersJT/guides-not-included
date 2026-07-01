import { cn } from '@/lib/utils'

interface ColorChoice {
	label: string
	value: string
}

interface ColorSwatchesProps {
	choices: ColorChoice[]
	value: string
	onChange: (color: string) => void
}

function ColorSwatches({ choices, value, onChange }: ColorSwatchesProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{choices.map(c => (
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

export default ColorSwatches
