<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
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

		void goto(`${base}/Grades`);
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

		void goto(`${base}/Grades`); // ✅ correct
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

<div class="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-background to-background/80">
	<!-- Background Decoration -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden">
		<div class="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
	</div>

	<main class="flex grow items-center justify-center relative z-10">
		<form onsubmit={login} class="m-4 flex w-full max-w-sm flex-col gap-8 animate-in fade-in slide-in-from-bottom duration-500 border border-white/20 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-2xl">
			<!-- Header -->
			<div class="mb-4 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top duration-500">
				<div class="p-3 bg-primary/10 rounded-xl border border-primary/20">
					<img src="{base}/favicon.svg" class="h-12 w-12 animate-in zoom-in duration-300" alt={brand} />
				</div>
				<div class="text-center">
					<h1 class="text-4xl font-bold animate-in fade-in duration-500 delay-100 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{brand}</h1>
					<p class="text-sm text-muted-foreground mt-2 animate-in fade-in duration-500 delay-200">The Better StudentVue, R.I.P. GradeVue🪦🕊️</p>
				</div>
			</div>

			<!-- Form Fields -->
			<Field.Group class="animate-in fade-in slide-in-from-bottom duration-500 delay-200 space-y-5">
				<Field.Field>
					<Field.Label for="username" class="text-sm font-medium">Username</Field.Label>
					<Input
						id="username"
						type="text"
						bind:value={username}
						placeholder="StudentVue Username"
						autocomplete="username"
						required
						class="transition-all duration-300 focus:ring-2 focus:ring-primary/50 cursor-text bg-background/50 border-white/10"
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="password" class="text-sm font-medium">Password</Field.Label>
					<Input
						type="password"
						id="password"
						bind:value={password}
						placeholder="StudentVue Password"
						autocomplete="current-password"
						required
						class="transition-all duration-300 focus:ring-2 focus:ring-primary/50 cursor-text bg-background/50 border-white/10"
					/>
				</Field.Field>

				<Field.Field>
					<Button type="submit" class="w-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-base font-semibold h-11 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg">
						<LogInIcon class="h-4 w-4 mr-2" /> Log In
					</Button>
				</Field.Field>
			</Field.Group>

			<!-- Divider -->
			<div class="flex items-center gap-3">
				<div class="flex-1 h-px bg-white/10"></div>
				<span class="text-xs text-muted-foreground">Secure Login</span>
				<div class="flex-1 h-px bg-white/10"></div>
			</div>

			<!-- Footer -->
			<div class="space-y-3 text-center animate-in fade-in duration-500 delay-300">
				<p class="text-xs text-muted-foreground">
					🔒 Your Login & Password Are Saved Locally, We Never See it!
				</p>
				<p class="text-xs text-muted-foreground">
					School Domain: <span class="font-semibold text-foreground">wa-nor-psv.edupoint.com</span>
				</p>
			</div>
			<Disclaimer />
		</form>
	</main>
</div>
