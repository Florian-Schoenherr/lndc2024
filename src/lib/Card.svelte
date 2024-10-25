<script lang="ts">
	import { Camera, Martini, Trees, Trophy } from 'lucide-svelte';
	import LikeButton from './LikeButton.svelte';

	let { title, description, icon, likes } = $props();
	let color = 'white';
</script>

<a
	href="#"
	class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
>
	<div class="flex gap-2">
		{#if icon == 'martini'}
			<Martini {color} />
		{:else if icon == 'camera'}
			<Camera {color} />
		{:else if icon == 'trees'}
			<Trees {color} />
		{:else if icon == 'trophy'}
			<Trophy {color} />
			<!-- // TODO: more -->
		{/if}
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{title}
		</h5>
		<div class="self-end">
			<LikeButton {likes} />
		</div>
	</div>
	<p class="font-normal text-gray-700 dark:text-gray-400">
		{description}
	</p>
</a>
