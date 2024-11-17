<script lang="ts">
	import { Heart } from 'lucide-svelte';
	export let likes = 0;
	export let isLikedbyUser = false;
	export let onClick: () => any; //for some reason the callback got unregsitered on data change if using $props() syntax
</script>

<button
	class="mb-2 flex items-center gap-1 text-2xl font-bold tracking-tight text-green-400 dark:text-white"
	onclick={onClick}
>
	{likes}
	{#if isLikedbyUser}
		<Heart color="green" fill="green" />
	{:else}
		<Heart color="green" />
	{/if}
</button>
