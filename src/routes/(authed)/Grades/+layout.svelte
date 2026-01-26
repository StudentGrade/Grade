<script lang="ts">
	import BoundaryFailure from '$lib/components/BoundaryFailure.svelte';
	import RefreshIndicator from '$lib/components/RefreshIndicator.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import * as Item from '$lib/components/ui/item';
	import { refreshIndicatorState } from '$lib/refreshIndicator.svelte';
	import { showLoadingNotification, hideLoadingNotification, notificationState } from '$lib/notificationState.svelte';
	import {
		getReportPeriodName,
		gradebookState,
		initializeGradebookCatalog,
		switchReportPeriod
	} from '$lib/Grades/catalog.svelte';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import GradebookLoadingBanner from './GradebookLoadingBanner.svelte';

	let { children } = $props();

	const loadingError = $derived(gradebookState.loadingError);

	const gradebookCatalog = $derived(gradebookState.gradebookCatalog);

	const loadingIndex = $derived(gradebookCatalog?.loadingIndex);

	const gradebookRecord = $derived(
		gradebookCatalog
			? gradebookCatalog.recordCache[
					gradebookCatalog.overrideIndex ?? gradebookCatalog.defaultIndex
				]
			: undefined
	);

	const defaultReportPeriodName = $derived(
		gradebookCatalog ? getReportPeriodName(gradebookCatalog.defaultIndex) : undefined
	);

	const loadingReportPeriodName = $derived(
		loadingIndex !== undefined ? getReportPeriodName(loadingIndex) : undefined
	);

	function resetReportPeriodOverride() {
		switchReportPeriod();
	}

	function refreshGradebook() {
		switchReportPeriod({
			overrideIndex: gradebookCatalog?.overrideIndex,
			forceRefresh: true
		});
	}

	onMount(() => {
		initializeGradebookCatalog();
	});

	// Update the refresh indicator state whenever gradebook record changes
	$effect(() => {
		if (gradebookRecord?.lastRefresh !== undefined) {
			refreshIndicatorState.lastRefresh = gradebookRecord.lastRefresh;
			refreshIndicatorState.canRefresh = loadingIndex === undefined;
			refreshIndicatorState.onRefresh = refreshGradebook;
		}
	});

	// Show/hide loading notification
	$effect(() => {
		if ((!gradebookCatalog || loadingIndex !== undefined) && loadingError === undefined) {
			showLoadingNotification(loadingReportPeriodName || 'Report Period', gradebookCatalog?.receivingData ? 'receiving' : 'pending');
		} else {
			hideLoadingNotification();
		}
	});
</script>

{#if gradebookRecord?.lastRefresh !== undefined}
	<!-- RefreshIndicator is now in the Header -->
{/if}

{#if loadingError !== undefined}
	<div in:slide={{ duration: 400 }} out:slide={{ duration: 300 }}>
		<Alert.Root variant="destructive" class="mx-auto w-fit min-w-sm m-4 animate-in fade-in slide-in-from-top-2 duration-500">
			<AlertCircleIcon />
			<Alert.Title>An error occurred while loading grades.</Alert.Title>
			<Alert.Description>
				{loadingError instanceof Error ? loadingError.message : String(loadingError)}
			</Alert.Description>
		</Alert.Root>
	</div>
{/if}

{#if gradebookCatalog?.overrideIndex !== undefined}
	<div class="m-4 flex justify-center" in:scale={{ start: 0.95, duration: 300 }} out:scale={{ start: 0.95, duration: 200 }}>
		<Item.Root variant="outline" size="sm" class="w-full max-w-3xl animate-in fade-in slide-in-from-top-3 duration-500">
			<Item.Media>
				<HistoryIcon class="size-5" />
			</Item.Media>

			<Item.Content>
				<Item.Title class="whitespace-nowrap">
					<span>
						Viewing grades from
						<span class="font-bold">
							{getReportPeriodName(gradebookCatalog.overrideIndex ?? gradebookCatalog.defaultIndex)}
						</span>
					</span>
				</Item.Title>
			</Item.Content>

			<Item.Actions>
				<Button onclick={resetReportPeriodOverride} variant="outline" class="transition-all duration-300 hover:scale-105">
					Return to {defaultReportPeriodName}
				</Button>
			</Item.Actions>
		</Item.Root>
	</div>
{/if}

<div in:fade={{ duration: 400 }}>
	<svelte:boundary>
		{@render children()}

		{#snippet failed(error, reset)}
			<BoundaryFailure {error} {reset} />
		{/snippet}
	</svelte:boundary>
</div>
