<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { LocalStorageKey } from '$lib';
	import { acc, loadStudentAccount } from '$lib/account.svelte';
	import { brand } from '$lib/brand';
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import LoadingBanner from '$lib/components/LoadingBanner.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { StudentAccount } from '$lib/synergy';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import LogInIcon from '@lucide/svelte/icons/log-in';
	import { fly } from 'svelte/transition';

	if (browser && localStorage.getItem(LocalStorageKey.token) !== null) {
		if (!acc.studentAccount) loadStudentAccount();

		void goto('/grades');
	}

	let username: string = $state('');
	let password: string = $state('');
	const domain = 'wa-nor-psv.edupoint.com';

	let loginError: string | undefined = $state();

	let loggingIn = $state(false);

	async function login(event: SubmitEvent) {
		event.preventDefault();

		if (loggingIn) return;
		loggingIn = true;

		const loginAccount = new StudentAccount(domain, username, password);

		try {
			await loginAccount.checkLogin();
		} catch (error) {
			loggingIn = false;

			loginError = error instanceof Error ? error.message : String(error);
			return;
		}

		acc.studentAccount = loginAccount;

		localStorage.setItem(LocalStorageKey.token, JSON.stringify({ username, password, domain }));

		loggingIn = false;

		void goto('/grades');
	}

</script>

<svelte:head>
	<title>Log In - {brand}</title>
</svelte:head>

{#if loggingIn}
	<LoadingBanner>Logging you in...</LoadingBanner>
{/if}

{#if loginError}
	<div in:fly={{ y: -50, duration: 200 }} class="fixed top-0 left-0 flex w-full justify-center p-4">
		<Alert.Root variant="destructive" class="w-fit">
			<AlertCircleIcon />
			<Alert.Title>Couldn't log in</Alert.Title>
			<Alert.Description>{loginError}</Alert.Description>
		</Alert.Root>
	</div>
{/if}

<div class="flex h-screen flex-col overflow-hidden">
	<main class="flex grow items-center justify-center">
		<form onsubmit={login} class="m-4 flex w-full max-w-sm flex-col gap-6 animate-in fade-in slide-in-from-bottom duration-500 border border-white rounded-lg p-8">
			<!-- Header -->
			<div class="mb-4 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top duration-500">
				<img src="/favicon.svg" class="h-10 w-10 animate-in zoom-in duration-300" alt={brand} />
				<h1 class="text-3xl font-bold animate-in fade-in duration-500 delay-100">{brand}</h1>
			</div>

			<!-- Form Fields -->
			<Field.Group class="animate-in fade-in slide-in-from-bottom duration-500 delay-200 space-y-5">
				<Field.Field>
					<Field.Label for="username" class="text-sm font-medium">Username</Field.Label>
					<Input
						id="username"
						type="text"
						bind:value={username}
						placeholder="student@school.net"
						autocomplete="username"
						required
						class="transition-all duration-300 focus:ring-2 focus:ring-primary/50 cursor-text"
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="password" class="text-sm font-medium">Password</Field.Label>
					<Input
						type="password"
						id="password"
						bind:value={password}
						autocomplete="current-password"
						required
						class="transition-all duration-300 focus:ring-2 focus:ring-primary/50 cursor-text"
					/>
				</Field.Field>

				<Field.Field>
					<Button type="submit" class="w-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-base font-semibold h-11">
						<LogInIcon class="h-4 w-4 mr-2" /> Log In
					</Button>
				</Field.Field>
			</Field.Group>

			<!-- Footer -->
			<p class="text-xs text-center text-muted-foreground animate-in fade-in duration-500 delay-300">
				Your credentials stay on your device. We never see your password.
			</p>
		</form>
	</main>
</div>
