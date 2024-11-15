<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import IdeaFormModal from '$lib/components/IdeaFormModal.svelte';
	import type { EventIdea } from '$lib/types.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let eventIdeas = $state(data.eventIdeas);
	let archivedEventIdeas = $state(data.archivedEventIdeas);
	let formModal = $state(false);
	let displayArchiv = $state(false);
	let likesAmountDictionary: { [key: string]: number } = $state(data.eventIdeasLikeAmount); //register change handler it will stay dynamic also on event updates.
	let userLikes: string[] = data.eventIdeasUserLiked;

	function toggleArchivView() {
		displayArchiv = !displayArchiv;
	}

	onMount(() => {
		// Connect to SSE
		const likeEventSource = new EventSource(`/api/ideas/likes/updates?clientId=${data.userId}`);
		likeEventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			//console.log('Like SSE Data:', data);
			likesAmountDictionary = data;
		};

		const ideaEventSource = new EventSource(`/api/ideas/updates?clientId=${data.userId}`);
		ideaEventSource.onmessage = (event) => {
			let data: EventIdea[] = JSON.parse(event.data);
			//console.log('Ideas SSE Data:', data);
			data = data.map((idea) => ({
				...idea,
				dateRange: {
					minDate: new Date(idea.dateRange.minDate),
					maxDate: new Date(idea.dateRange.maxDate)
				}
			}));
			//console.log('Ideas SSE Data:', data);

			eventIdeas = data;
		};

		const archivedIdeasEventSource = new EventSource(
			`/api/ideas/archived/updates?clientId=${data.userId}`
		);

		archivedIdeasEventSource.onmessage = (event) => {
			let data: EventIdea[] = JSON.parse(event.data);
			//console.log('Archived Ideas SSE Data:', data);
			data = data.map((idea) => ({
				...idea,
				dateRange: {
					minDate: new Date(idea.dateRange.minDate),
					maxDate: new Date(idea.dateRange.maxDate)
				}
			}));
			//console.log('Archived Ideas SSE Data:', data);
			archivedEventIdeas = data;
		};

		// Cleanup on destroy
		return () => {
			likeEventSource.close();
			ideaEventSource.close();
			archivedIdeasEventSource.close();
		};
	});
</script>

<!-- {#if !mapModal} -->

<div class="flex flex-col h-full">
	<header id="header">
		<h1 class="text-4xl font-bold p-2 text-center">Eventmaps Ideen</h1>
		<div class="w-100 bg-orange-200 font-bold text-center">
			TESTVERSION - NUR IN ZWICKAU VERFUEGBAR
		</div>
		<div class="flex flex-row w-full items-center justify-center gap-5 h-12 px-2">
			<div>Impressum</div>
			<div>Über uns</div>
			<div>Datenschutz</div>
			<button
				onclick={toggleArchivView}
				class="text-center w-40 h-8 border-orange-400 border-2 text-orange-400 rounded-md"
				class:bg-orange-400={displayArchiv}
				class:text-white={displayArchiv}
				class:text-orange-400={!displayArchiv}
				class:bg-white={!displayArchiv}
			>
				Archiv
			</button>
		</div>
	</header>

	<main class="flex-grow overflow-y-auto">
		{#if !displayArchiv}
			{#each eventIdeas as idea}
				<Card
					{idea}
					link={'/details/' + idea.id}
					isLikedbyUser={userLikes.includes(data.userId)}
					likeAmount={likesAmountDictionary[idea.id]}
					isEnabled={true}
				/>
			{/each}
		{/if}

		{#if displayArchiv}
			{#each archivedEventIdeas as idea}
				<Card
					{idea}
					link={false}
					isLikedbyUser={userLikes.includes(data.userId)}
					likeAmount={likesAmountDictionary[idea.id]}
					isEnabled={false}
				/>
			{/each}
		{/if}
	</main>

	<footer id="footer" class="h-14 w-full flex items-center justify-center">
		{#if !displayArchiv}
			<button
				class="w-full h-full text-2xl bg-orange-400 text-white font-bold"
				onclick={() => (formModal = true)}
			>
				Idee einreichen
			</button>
		{/if}
	</footer>
</div>

<IdeaFormModal size="xs" bind:isOpen={formModal} />
