<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import IdeaFormModal from '$lib/components/IdeaFormModal.svelte';

	let { data } = $props();

	let eventIdeas = $state(data.eventIdeas);
	let formModal = $state(false);
</script>

<!-- {#if !mapModal} -->
<h1 class="text-4xl font-bold p-2 text-center">Eventideen</h1>
{#each eventIdeas as idea}
	<Card {idea} link isLikedbyUser={data.likedEventIds.includes(idea.id)} userID={data.clientId} />
{/each}

<button
	class="fixed bottom-0 z-1 w-full h-14 text-2xl bg-orange-400 text-white font-bold rounded"
	on:click={() => (formModal = true)}
>
	Idee einreichen
</button>

<IdeaFormModal size="xs" bind:isOpen={formModal} />
