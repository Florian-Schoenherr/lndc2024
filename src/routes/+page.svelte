<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import IdeaFormModal from '$lib/components/IdeaFormModal.svelte';

	let { data } = $props();

	let eventIdeas = $state(data.eventIdeas);
	let formModal = $state(false);
</script>

<!-- {#if !mapModal} -->

<div class="flex flex-col h-full">
	<header id="header f">
		<h1 class="text-4xl font-bold p-2 text-center">Eventmaps Ideen</h1>
		<div class="w-100 bg-orange-200 font-bold text-center">
			TESTVERSION - NUR IN ZWICKAU VERFUEGBAR
		</div>
		<div class="flex flex-row w-full items-center justify-center gap-5">
			<div>Impressum</div>
			<div>Über uns</div>
			<div>Datenschutz</div>
		</div>
	</header>

	<main class="flex-grow overflow-y-auto">
		{#each eventIdeas as idea}
			<Card
				{idea}
				link={false}
				isLikedbyUser={data.eventIdeasUserLiked.includes(idea.id)}
				likeAmount={data.eventIdeasLikeAmount[idea.id]}
			/>
		{/each}
	</main>

	<footer id="footer" class="h-14 w-full flex items-center justify-center">
		<button
			class="w-full h-full text-2xl bg-orange-400 text-white font-bold"
			on:click={() => (formModal = true)}
		>
			Idee einreichen
		</button>
	</footer>
</div>

<IdeaFormModal size="xs" bind:isOpen={formModal} />
