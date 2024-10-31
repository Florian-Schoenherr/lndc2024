<script lang="ts">
	import { Heart } from 'lucide-svelte';
	let { likes, isLikedbyUser, click } = $props();
</script>

<button
	class="mb-2 flex items-center gap-1 text-2xl font-bold tracking-tight text-green-400 dark:text-white"
	on:click={click}
	type="submit"
>
	{likes}
	{#if isLikedbyUser}
		<Heart color="green" fill="green" />
	{:else}
		<Heart color="green" />
	{/if}
</button>
