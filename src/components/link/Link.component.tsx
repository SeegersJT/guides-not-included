import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LinkType = 'text' | 'button' | 'nav' | 'card'
type LinkVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive'

interface LinkProps extends Omit<RouterLinkProps, 'to'> {
	to: string
	text?: string
	type?: LinkType
	variant?: LinkVariant
}

const BASE_STYLES: Record<LinkType, string> = {
	text: '',
	button: 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
	nav: 'rounded-md px-3 py-2 text-sm font-medium transition-colors',
	card: 'group flex flex-col overflow-hidden rounded-xl border transition-all',
}

const VARIANT_STYLES: Record<LinkType, Partial<Record<LinkVariant, string>>> = {
	text: {
		default: 'text-primary hover:underline',
		secondary: 'text-muted-foreground hover:underline',
		destructive: 'text-destructive hover:underline',
	},
	button: {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		outline: 'border border-border bg-transparent hover:bg-secondary',
		ghost: 'bg-transparent hover:bg-secondary',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
		destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
	},
	nav: {
		default: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
		ghost: 'text-foreground hover:bg-secondary/50',
	},
	card: {
		default:
			'border-border bg-card hover:border-primary/50 hover:shadow-[var(--shadow-glow-teal)]',
		ghost: 'border-transparent bg-transparent hover:bg-secondary/30',
	},
}

const DEFAULT_VARIANT: LinkVariant = 'default'

function Link({
	to,
	text,
	type = 'text',
	variant = DEFAULT_VARIANT,
	className,
	children,
	...rest
}: LinkProps) {
	const variantClass = VARIANT_STYLES[type][variant] ?? VARIANT_STYLES[type][DEFAULT_VARIANT]

	return (
		<RouterLink to={to} className={cn(BASE_STYLES[type], variantClass, className)} {...rest}>
			{text ?? children}
		</RouterLink>
	)
}

export default Link
