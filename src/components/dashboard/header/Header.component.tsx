import MASCOT_ICON from '@/assets/mascot.png'
import Link from '@/components/link/Link.component'

function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
				<div onClick={() => '/'} className="flex items-center gap-2.5 hover:cursor-pointer">
					<img
						src={MASCOT_ICON}
						alt=""
						width={40}
						height={40}
						className="size-9 object-contain"
					/>
					<span className="font-display text-lg font-bold leading-none">
						Guides <span className="text-primary text-glow-teal">Not Included</span>
					</span>
				</div>

				<nav className="hidden items-center gap-2 md:flex">
					<Link to="/guides" type="nav" text="Browse Guides" />

					{/* TODO - HANDLE LOGGED IN USERS */}
					{/* {user ? (
						<>
							<Button asChild variant="hero" size="sm" className="ml-2">
								<Link to="/create">
									<PlusCircle className="size-4" /> New Guide
								</Link>
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger className="ml-1 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
									<Avatar className="size-9 border border-border">
										<AvatarImage
											src={profile?.avatar_url ?? undefined}
											alt=""
										/>
										<AvatarFallback className="bg-secondary text-xs">
											{initials}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-52">
									<DropdownMenuLabel className="truncate">
										{profile?.display_name ?? 'Duplicant'}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link to="/account">
											<BookOpen className="size-4" /> My Guides
										</Link>
									</DropdownMenuItem>
									{profile && (
										<DropdownMenuItem asChild>
											<Link
												to="/u/$username"
												params={{ username: profile.username }}
											>
												<User className="size-4" /> My Profile
											</Link>
										</DropdownMenuItem>
									)}
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignOut}>
										<LogOut className="size-4" /> Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<Button asChild variant="hero" size="sm" className="ml-2">
							<Link to="/auth">Sign in</Link>
						</Button>
					)} */}

					<Link to="/auth" type="button" text="Sign In" />
				</nav>

				<button
					className="cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
					// onClick={() => setMobileOpen(o => !o)}
					aria-label="Toggle menu"
				>
					{/* {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />} */}
				</button>
			</div>

			{/* TODO - HANDLE MOBILE VIEW MENU */}
			{/* {mobileOpen && (
				<div className="border-t border-border bg-background px-4 py-3 md:hidden">
					<nav className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
						<Link
							to="/guides"
							className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
						>
							Browse Guides
						</Link>

						<Link
							to="/guides"
							search={{ category: undefined }}
							className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
						>
							Browse by category
						</Link>

						{user ? (
							<>
								<Link
									to="/create"
									className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
								>
									New Guide
								</Link>
								<Link
									to="/account"
									className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
								>
									My Guides
								</Link>
								<button
									onClick={handleSignOut}
									className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
								>
									Sign out
								</button>
							</>
						) : (
							<Link
								to="/auth"
								className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
							>
								Sign in
							</Link>
						)}
					</nav>
				</div>
			)} */}
		</header>
	)
}

export default Header
