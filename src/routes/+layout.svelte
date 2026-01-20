<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<Header />

<Toaster />

<div class="pt-16 overflow-x-hidden">
	{@render children()}
</div>
