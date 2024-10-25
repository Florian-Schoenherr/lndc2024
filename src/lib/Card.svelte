<script lang="ts">
	import { Camera, Martini, Trees, Trophy, CandyCane } from 'lucide-svelte';
	import LikeButton from './LikeButton.svelte';
	import type { EventIdea } from './types';

	export let idea: EventIdea;
</script>

<a
	href={`/details/${idea.id}`}
	class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
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
		{:else if idea.icon == 'trophy'}
			<CandyCane class="h-16 w-16 dark:stroke-white" />
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
			{idea.location.toString().slice(0, 6)}
		</div>
		<div>
			{idea.date.toLocaleString().split(',')[1]}
		</div>

		<div>
			{idea.date.toLocaleString().split(',')[0]}
		</div>
		<div></div>
	</div>
</a>
