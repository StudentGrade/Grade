<script lang="ts">
	import { brand } from '$lib/brand';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { fade } from 'svelte/transition';
	import type { Component } from 'svelte';

	let isMenuOpen = $state(false);
	let isHamburgerHovered = $state(false);

	function closeMenu() {
		isMenuOpen = false;
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function logOut() {
		localStorage.clear();
		location.assign('/login');
	}
</script>

<!-- Global Header with Hamburger Menu -->
<div class="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/30 h-16 flex items-center px-4 backdrop-blur-md animate-in fade-in duration-300">
	<!-- Hamburger Button -->
	<button 
		type="button"
		onclick={toggleMenu}
		onmouseenter={() => isHamburgerHovered = true}
		onmouseleave={() => isHamburgerHovered = false}
		class:menu-open={isMenuOpen}
		class="hamburger"
		aria-label="Toggle menu"
	>
		<span></span>
		<span></span>
		<span></span>
	</button>

	<!-- Brand Logo -->
	<a
		href="/grades"
		class="absolute left-20 flex items-center gap-2 text-xl font-bold tracking-tight whitespace-nowrap text-white animate-in fade-in slide-in-from-left duration-500 cursor-pointer hover:opacity-80 transition-opacity"
	>
		<img src="/favicon.svg" class="size-6" alt={brand} />
		{brand}
	</a>
</div>

<!-- Mobile Menu Overlay -->
{#if isMenuOpen}
	<div 
		class="fixed inset-0 z-40 bg-black/50 cursor-pointer"
		onclick={closeMenu}
		onkeydown={(e) => e.key === 'Escape' && closeMenu()}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 150 }}
	></div>
{/if}

<!-- Mobile Menu -->
{#if isMenuOpen}
	<div 
			class="fixed left-0 top-16 w-64 bg-card border-r border-border/30 shadow-lg z-40 max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden animate-in slide-in-from-left duration-300 ease-out"
			transition:fade={{ duration: 150 }}
		>
			<nav class="py-4">
				<a href="/grades" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 whitespace-nowrap" onclick={closeMenu}>
					Grades
				</a>
				<a href="/attendance" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-75 whitespace-nowrap" onclick={closeMenu}>
					Attendance
				</a>
				<a href="/documents" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-100 whitespace-nowrap" onclick={closeMenu}>
					Documents
				</a>
				<a href="/mail" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-125 whitespace-nowrap" onclick={closeMenu}>
					Mail
				</a>
				<a href="/studentinfo" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-150 whitespace-nowrap" onclick={closeMenu}>
					Student Info
				</a>
			</nav>

			<!-- Sign Out Button -->
			<div class="border-t border-border/30 p-4">
				<button 
					type="button"
					onclick={logOut}
					class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200 rounded-lg cursor-pointer font-medium text-sm"
				>
					<LogOutIcon class="h-4 w-4" />
					Sign Out
				</button>
			</div>
		</div>
{/if}
