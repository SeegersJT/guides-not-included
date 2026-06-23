import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

type Selector<TState = unknown, TResult = unknown> = (state: TState) => TResult

interface RedirectProps<TState = unknown> {
	to: string
	when?: boolean
	selector?: Selector<TState>
	replace?: boolean
	state?: unknown
	fallback?: React.ReactNode
}

export function Redirect<TState = unknown>({
	to,
	when = true,
	selector,
	replace = true,
	state,
	fallback = null,
}: RedirectProps<TState>) {
	const navigate = useNavigate()

	const selectorResult = useSelector<TState, unknown>(selector ?? (() => null))

	const shouldRedirect = selector !== undefined ? Boolean(selectorResult) : Boolean(when)

	useEffect(() => {
		if (shouldRedirect) {
			navigate(to, { replace, state })
		}
	}, [shouldRedirect, to, replace, state, navigate])

	if (shouldRedirect) return null
	return fallback
}

export default Redirect
