<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { LocalStorageKey } from '$lib';
	import { acc, loadStudentAccount } from '$lib/account.svelte';
	import { brand } from '$lib/brand';
	import BoundaryFailure from '$lib/components/BoundaryFailure.svelte';
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	let { children } = $props();

	if (browser && !acc.studentAccount) {
		if (localStorage.getItem(LocalStorageKey.token) !== null) {
			loadStudentAccount();
		} else {
			void goto('/login');
		}
	}
</script>

<svelte:boundary>
	<!-- Main Content Area -->
	<main>
		<div class="flex flex-1 flex-col min-h-screen">
			<svelte:boundary>
				{@render children()}

				{#snippet pending()}
					<div class="flex min-h-screen w-full items-center justify-center">
						<Spinner class="size-8" />
					</div>
				{/snippet}

				{#snippet failed(error, reset)}
					<BoundaryFailure {error} {reset} />
				{/snippet}
			</svelte:boundary>
		</div>

		<div class="mt-auto w-full text-xs">
			<Disclaimer trademark={false} />
		</div>
	</main>

	{#snippet failed(error, reset)}
		<BoundaryFailure {error} {reset} />
	{/snippet}
</svelte:boundary>
