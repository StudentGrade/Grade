<script>
	import { brand, contactEmail, repoLink } from '$lib/brand';
	import { Button } from '$lib/components/ui/button';
	import GithubIcon from '@lucide/svelte/icons/github';
	import SendIcon from '@lucide/svelte/icons/send';
</script>

<svelte:head>
	<title>Feedback - {brand}</title>
</svelte:head>

<div class="m-4 mt-8 space-y-4">
	<h1 class="text-2xl font-bold">Feedback & Support</h1>

	<p>Have questions or feedback? Reach out to us:</p>

	<div class="flex flex-col gap-4">
		<Button href="{repoLink}" target="_blank" variant="outline" class="h-auto w-fit">
			<GithubIcon /> View on GitHub
		</Button>

		<Button href="mailto:{contactEmail}" variant="outline" class="h-auto w-fit">
			<SendIcon /> Send us an email
		</Button>
	</div>
</div>
