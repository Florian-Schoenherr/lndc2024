<script lang="ts">
	import { Camera, Martini, Trees, Trophy, CandyCane, Volleyball } from 'lucide-svelte';
	import LikeButton from './LikeButton.svelte';
	import type { EventIdea } from './types';

	export let idea: EventIdea;
	export let link = false;
</script>

<svelte:element
	this={link ? 'a' : 'div'}
	href={link ? `/details/${idea.id}` : undefined}
	class={'block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ' +
		(link ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : '')}
>
	<div class="flex gap-2 items-center">
		{#if idea.icon == 'martini'}
			<Martini class="h-16 w-16 dark:stroke-white" />
		{:else if idea.icon == 'camera'}
			<Camera class="h-16 w-16 dark:stroke-white" />
		{:else if idea.icon == 'trees'}
			<Trees class="h-16 w-16 dark:stroke-white" />
		{:else if idea.icon == 'trophy'}
			<Trophy class="h-16 w-16 dark:stroke-white" />
		{:else if idea.icon == 'candycane'}
			<CandyCane class="h-16 w-16 dark:stroke-white" />
		{:else if idea.icon == 'volleyball'}
			<Volleyball class="h-16 w-16 dark:stroke-white" />
		{/if}
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{idea.title}
		</h5>
		<div class="ml-auto">
			<LikeButton likes={idea.likes} />
		</div>
	</div>

	<div class="flex flex-row w-full gap-5 mt-5 justify-evenly text-xl dark:text-white">
		<div>
			{idea.townPrecomputed}
		</div>
		<div>
			{Intl.DateTimeFormat('de-DE', {
				dateStyle: 'medium',
				timeStyle: 'short'
			}).format(idea.date)}
		</div>
	</div>
	<slot />
</svelte:element>
