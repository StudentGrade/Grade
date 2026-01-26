<script lang="ts">
	import { notificationState } from '$lib/notificationState.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import NumberFlow from '@number-flow/svelte';
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import InfoIcon from '@lucide/svelte/icons/info';

	let stopwatch = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			if (notificationState.loadingNotification) {
				stopwatch += 1;
				if (notificationState.loadingNotification) {
					notificationState.loadingNotification.stopwatch = stopwatch;
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	function getIcon(type: 'loading' | 'success' | 'error' | 'info') {
		switch (type) {
			case 'loading':
				return Spinner;
			case 'success':
				return CheckCircle2Icon;
			case 'error':
				return AlertCircleIcon;
			default:
				return InfoIcon;
		}
	}

	function getStyles(type: 'loading' | 'success' | 'error' | 'info') {
		switch (type) {
			case 'error':
				return 'border-destructive/50 bg-destructive/10';
			case 'success':
				return 'border-green-500/50 bg-green-500/10';
			case 'info':
				return 'border-blue-500/50 bg-blue-500/10';
			default:
				return 'border-white/20 bg-card';
		}
	}
</script>

<!-- Notification Stack Container -->
<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
	<!-- Loading Notification (stays at bottom) -->
	{#if notificationState.loadingNotification}
		<div
			class={`rounded-lg shadow-lg p-4 min-w-64 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300 border pointer-events-auto ${getStyles(notificationState.loadingNotification.type)}`}
			in:slide={{ axis: 'x', duration: 300 }}
			out:slide={{ axis: 'x', duration: 300 }}
		>
			<div class="flex items-start gap-3">
				<div class="mt-1">
				<svelte:component this={getIcon(notificationState.loadingNotification.type)} class="h-5 w-5" />
				</div>
				<div class="flex-1 min-w-0">
					<div class="font-semibold text-sm text-foreground">
						{notificationState.loadingNotification.message}
					</div>
					<div class="text-xs text-muted-foreground mt-1">
						📥 Receiving
						<NumberFlow value={notificationState.loadingNotification.stopwatch ?? 0} suffix="s" />
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Other Notifications Stack (above loading notification) -->
	{#each notificationState.notifications as notification (notification.id)}
		<div
			class={`rounded-lg shadow-lg p-4 min-w-64 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300 border pointer-events-auto ${getStyles(notification.type)}`}
			in:slide={{ axis: 'x', duration: 300 }}
			out:slide={{ axis: 'x', duration: 300 }}
		>
			<div class="flex items-start gap-3">
				<div class="mt-0.5">
				<svelte:component this={getIcon(notification.type)} class="h-5 w-5" />
				</div>
				<div class="flex-1 min-w-0">
					<div class="text-sm text-foreground">
						{notification.message}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

