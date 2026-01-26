<script lang="ts">
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Header from './Header.svelte';
	import LoadingNotification from '$lib/components/LoadingNotification.svelte';

	let { children } = $props();
	
	// Hide header on login and signup pages
	const isAuthPage = $derived($page.route.id?.includes('login') || $page.route.id?.includes('signup'));
</script>

<ModeWatcher />

{#if !isAuthPage}
	<Header />
{/if}

<Toaster />

<LoadingNotification />

<div class={isAuthPage ? 'overflow-x-hidden' : 'pt-16 overflow-x-hidden'}>
	{@render children()}
</div>
