<script lang="ts">
	import { removeCourseType } from '$lib';
	import { brand } from '$lib/brand';
	import { Spinner } from '$lib/components/ui/spinner';
	import { initializeGradebookCatalog } from '$lib/grades/catalog.svelte';
	import { getActiveGradebook } from '$lib/grades/gradebook';
	import AppWindowMacIcon from '@lucide/svelte/icons/app-window-mac';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CircleUserIcon from '@lucide/svelte/icons/circle-user';
	import EllipsisVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';
	import FolderOpenIcon from '@lucide/svelte/icons/folder-open';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import MessageSquareWarningIcon from '@lucide/svelte/icons/message-square-warning';
	import NotebookTextIcon from '@lucide/svelte/icons/notebook-text';
	import X from '@lucide/svelte/icons/x';
	import Menu from '@lucide/svelte/icons/menu';
	import { onMount, type Component } from 'svelte';
	import { fade } from 'svelte/transition';
	import { installPrompt } from '../../hooks.client';
	import { loadStudentInfo, studentInfoState } from './studentinfo/studentInfo.svelte';

	let isMenuOpen = $state(false);

	function logOut() {
		localStorage.clear();
		location.assign('/login');
	}

	const courses = $derived(getActiveGradebook()?.Courses.Course);

	function installWebApp() {
		$installPrompt.prompt?.();
	}

	loadStudentInfo();

	const data = {
		grades: {
			title: 'Grades',
			url: '/grades',
			icon: NotebookTextIcon
		},
		header: [
			{
				title: 'Attendance',
				url: '/attendance',
				icon: BellIcon
			},
			{
				title: 'Documents',
				url: '/documents',
				icon: FolderOpenIcon
			},
			{
				title: 'Mail',
				url: '/mail',
				icon: InboxIcon
			}
		],
		pwa: {
			title: 'Install Web App',
			icon: AppWindowMacIcon,
			onclick: installWebApp
		},
		feedback: {
			title: 'Feedback',
			url: '/feedback',
			icon: MessageSquareWarningIcon
		},
		user: {
			title: studentInfoState.data?.FormattedName ?? 'Student Info',
			url: '/studentinfo',
			icon: CircleUserIcon
		},
		logout: {
			title: 'Log Out',
			onclick: logOut,
			icon: LogOutIcon
		}
	};

	onMount(() => {
		initializeGradebookCatalog();
	});
</script>

{#snippet menuItem({
	title,
	url,
	onclick,
	icon: Icon
}: {
	title: string;
	url?: string;
	onclick?: () => void;
	icon: Component;
})}
	<div class="px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors">
		{#if url}
			<a href={url} class="flex items-center gap-3 text-foreground no-underline" on:click={() => isMenuOpen = false}>
				<Icon class="h-5 w-5 text-primary" />
				<span class="font-medium">{title}</span>
			</a>
		{:else}
			<button 
				type="button"
				on:click={() => {
					onclick?.();
					isMenuOpen = false;
				}} 
				class="w-full flex items-center gap-3 text-foreground bg-transparent border-none cursor-pointer"
			>
				<Icon class="h-5 w-5 text-primary" />
				<span class="font-medium">{title}</span>
			</button>
		{/if}
	</div>
{/snippet}

<!-- Hamburger Menu Header (Mobile Only) -->
<div class="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/30 h-16 flex items-center px-4 block md:hidden backdrop-blur-md animate-in fade-in duration-300">
	<button 
		type="button"
		on:click={() => isMenuOpen = !isMenuOpen}
		class="p-2 -ml-2 hover:bg-muted/50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
		aria-label="Toggle menu"
	>
		{#if isMenuOpen}
			<X class="h-7 w-7 text-white stroke-[2.5] animate-in spin-in-90 duration-300" />
		{:else}
			<Menu class="h-7 w-7 text-white stroke-[2.5] animate-in fade-in duration-300" />
		{/if}
	</button>
	<a
		href="/grades"
		class="mr-auto ml-3 flex items-center gap-2 text-xl font-bold tracking-tight whitespace-nowrap text-white animate-in fade-in slide-in-from-left duration-500"
	>
		<img src="/favicon.svg" class="size-6" alt={brand} />
		{brand}
	</a>
</div>

<!-- Mobile Dropdown Menu Overlay -->
{#if isMenuOpen}
	<div 
		class="fixed inset-0 z-40 block md:hidden bg-black/50"
		on:click={() => isMenuOpen = false}
		on:keydown={(e) => e.key === 'Escape' && (isMenuOpen = false)}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 150 }}
	/>
{/if}

<!-- Mobile Dropdown Menu -->
{#if isMenuOpen}
	<div 
		class="fixed left-0 top-16 w-64 bg-card border-r border-border/30 shadow-lg z-40 max-h-[calc(100vh-4rem)] overflow-y-auto block md:hidden animate-in slide-in-from-left duration-300 ease-out"
		transition:fade={{ duration: 150 }}
		onmouseleave={() => isMenuOpen = false}
	>
		<!-- Header -->
		<div class="p-4 border-b border-border/30">
			<div class="flex flex-row items-center gap-2">
				<img src="/favicon.svg" class="size-6" alt={brand} />
				<span class="text-lg font-bold tracking-tight">{brand}</span>
			</div>
		</div>

		<!-- Main Menu -->
		<div class="py-2">
			<div class="animate-in fade-in slide-in-from-left duration-300 delay-75">
				{@render menuItem(data.grades)}
			</div>

			{#if courses}
				<div class="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase animate-in fade-in duration-300 delay-100">Courses</div>
				{#each courses as Course, index (Course._CourseID)}
					<div class="px-4 py-2 border-b border-border/10 hover:bg-muted/30 transition-all duration-200 animate-in fade-in slide-in-from-left duration-300" style="animation-delay: {(150 + index * 50)}ms">
						<button
							type="button"
							class="text-sm text-foreground no-underline hover:text-foreground w-full text-left bg-transparent border-none cursor-pointer"
							on:click={() => {
								window.location.href = `${data.grades.url}/${index.toString()}`;
								isMenuOpen = false;
							}}
						>
							{removeCourseType(Course._CourseName)}
						</button>
					</div>
				{/each}
			{:else}
				<div class="px-4 py-4 flex items-center justify-center animate-in fade-in duration-300">
					<Spinner class="size-4" />
				</div>
			{/if}

			{#each data.header as item, idx (item.title)}
				<div class="animate-in fade-in slide-in-from-left duration-300" style="animation-delay: {(200 + idx * 75)}ms">
					{@render menuItem(item)}
				</div>
			{/each}
		</div>

		<!-- Footer -->
		<div class="py-2 border-t border-border/30 mt-auto">
			{#if $installPrompt.prompt}
				<div transition:fade>
					{@render menuItem(data.pwa)}
				</div>
			{/if}

			{@render menuItem(data.feedback)}

			<div class="px-4 py-3 border-b border-border/20">
				<button
					type="button"
					class="flex items-center gap-3 text-foreground no-underline w-full bg-transparent border-none cursor-pointer"
					on:click={() => {
						window.location.href = data.user.url;
						isMenuOpen = false;
					}}
				>
					<data.user.icon class="h-5 w-5 text-primary" />
					<span class="font-medium truncate">{data.user.title}</span>
				</button>
			</div>

			<!-- Logout -->
			<div class="flex flex-col">
				<button 
					type="button"
					on:click={data.logout.onclick}
					class="px-4 py-3 flex items-center gap-3 text-foreground bg-transparent border-none hover:bg-destructive/10 transition-colors w-full justify-start cursor-pointer"
				>
					<data.logout.icon class="h-5 w-5 text-destructive" />
					<span class="font-medium text-destructive">{data.logout.title}</span>
				</button>
			</div>
		</div>
	</div>
{/if}
