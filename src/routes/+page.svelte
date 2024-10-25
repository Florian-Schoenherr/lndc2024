<script lang="ts">
	import Card from '$lib/Card.svelte';
	import type { PageData } from './$types';

	let { data } = $props();
	let eventIdeas = $state(data.eventIdeas);
	// export let data: PageData;
	// $: eventIdeas = data.eventIdeas;
</script>

{#each eventIdeas as { title, description, icon, likes }}
	<Card {title} {description} {icon} {likes} />
{/each}
