<script lang="ts">
	import { brand } from '$lib/brand';
	import { base } from '$app/paths';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import { fade } from 'svelte/transition';
	import type { Component } from 'svelte';
	import { refreshIndicatorState } from '$lib/refreshIndicator.svelte';

	let isMenuOpen = $state(false);
	let isHamburgerHovered = $state(false);
	let isRefreshing = $state(false);

	let minutesAgo = $derived.by(() => {
		if (!refreshIndicatorState.lastRefresh) return undefined;
		const now = new Date();
		const diff = now.getTime() - refreshIndicatorState.lastRefresh;
		const minutes = Math.floor(diff / 60000);
		return minutes === 0 ? 'just now' : `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
	});

	function closeMenu() {
		isMenuOpen = false;
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function logOut() {
		localStorage.clear();
		location.assign(base + '/login');
	}

	function refresh() {
		if (refreshIndicatorState.onRefresh && !isRefreshing) {
			isRefreshing = true;
			refreshIndicatorState.onRefresh();
			setTimeout(() => {
				isRefreshing = false;
			}, 1500);
		}
	}
</script>

<!-- Global Header with Hamburger Menu -->
<div class="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/20 h-16 flex items-center px-4 backdrop-blur-md animate-in fade-in duration-300">
	<!-- Left Section: Hamburger Button -->
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

	<!-- Center Section: Brand Logo (Absolutely Centered) -->
	<a
		href="{base}/Grades"
		class="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xl font-bold tracking-tight whitespace-nowrap text-white cursor-pointer hover:opacity-80 transition-opacity"
	>
		<img src="{base}/favicon.svg" class="size-6" alt={brand} />
		{brand}
	</a>

	<!-- Right Section: Last Updated and Refresh -->
	{#if minutesAgo && !refreshIndicatorState.isRefreshing}
		<div class="ml-auto flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-500">
			<span class="text-xs text-muted-foreground hidden sm:inline">Last updated {minutesAgo}</span>
			<button
				type="button"
				onclick={refresh}
				disabled={!refreshIndicatorState.canRefresh || isRefreshing}
				class={`p-2 hover:bg-muted/50 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
					isRefreshing ? 'animate-spin' : 'hover:scale-110 active:scale-95'
				}`}
				title="Refresh data"
			>
				<RefreshCwIcon class="h-4 w-4 text-foreground" />
			</button>
		</div>
	{:else}
		<div class="ml-auto"></div>
	{/if}
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
			class="fixed left-0 top-16 w-64 bg-card border-r border-white/20 shadow-lg z-40 max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden animate-in slide-in-from-left duration-300 ease-out"
			transition:fade={{ duration: 150 }}
		>
			<nav class="py-4">
				<a href="{base}/Grades" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 whitespace-nowrap" onclick={closeMenu}>
					Grades
				</a>
				<a href="{base}/attendance" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-75 whitespace-nowrap" onclick={closeMenu}>
					Attendance
				</a>
				<a href="{base}/documents" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-100 whitespace-nowrap" onclick={closeMenu}>
					Documents
				</a>
				<a href="{base}/mail" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-125 whitespace-nowrap" onclick={closeMenu}>
					Mail
				</a>
				<a href="{base}/studentinfo" class="block px-4 py-3 text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:text-primary animate-in fade-in slide-in-from-left duration-300 delay-150 whitespace-nowrap" onclick={closeMenu}>
					Student Info
				</a>
			</nav>

			<!-- Sign Out Button -->
			<div class="border-t border-white/20 p-4">
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
