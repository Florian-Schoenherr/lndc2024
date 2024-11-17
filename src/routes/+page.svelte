<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import IdeaFormModal from '$lib/components/IdeaFormModal.svelte';
	import type { EventIdea } from '$lib/types.js';
	import { onMount } from 'svelte';

	let { data } = $props(); //set to empty list to avoid UI lag while async request is not resolved.

	let eventIdeas = $state(data.eventIdeas);
	let archivedEventIdeas = $state(data.archivedEventIdeas);
	let likesAmountDictionary: { [key: string]: number } = $state(data.eventIdeasLikeAmount); //register change handler it will stay dynamic also on event updates.
	let userLikes: string[] = $state(data.eventIdeasUserLiked);

	let formModal = $state(false);
	let displayArchiv = $state(false);

	function toggleArchivView() {
		displayArchiv = !displayArchiv;
	}

	const getLikeAmount = (ideaId: string, idea: EventIdea) => {
		let likes = likesAmountDictionary[ideaId];
		//There was a bug: while having three ideas and setting a like so an order changes the like and like marker kept on the previous card, after adding (item.id) to the foreach loop it disappered.
		//I dont know why ??
		// https://svelte.dev/docs/svelte/each
		//console.log(`Get likes amount on idea ${idea.id} reads: ${likes}`);
		if (likes) {
			return likes;
		} else {
			return 0;
		}
	};

	onMount(() => {
		// Connect to SSE and update data then from
		let i = 0;
		const likeEventSource = new EventSource(`/api/ideas/likes/updates?clientId=${data.userId}`);
		likeEventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			//console.log('Like SSE Data:', data);

			likesAmountDictionary = data;
			//console.log('likeDict:', likesAmountDictionary);
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

		console.log('userLikes', userLikes);

		// Cleanup on destroy
		return () => {
			likeEventSource.close();
			ideaEventSource.close();
			archivedIdeasEventSource.close();
		};
	});

	async function handleIdeaLike(ideaID: string, oldLikedState: boolean) {
		console.log(`called handleIdeaLike ideaID${ideaID} oldLikeState: ${oldLikedState}`);

		if (oldLikedState === true) {
			//when there was a like remove the like
			//update like Amounts
			console.log('Before:', likesAmountDictionary);
			if (likesAmountDictionary[ideaID]) {
				likesAmountDictionary[ideaID] = likesAmountDictionary[ideaID] - 1;
			}
			console.log('After: ', likesAmountDictionary);

			//update userlikes
			let elementIndex = userLikes.indexOf(ideaID);
			if (elementIndex > -1) {
				userLikes = userLikes.toSpliced(elementIndex, 1);
			}
			console.log(userLikes);
		} else {
			//when there was no like add the like
			//update like Amounts
			console.log('Before: ', likesAmountDictionary);
			if (!likesAmountDictionary[ideaID]) {
				likesAmountDictionary[ideaID] = 0;
			}
			likesAmountDictionary[ideaID] = likesAmountDictionary[ideaID] + 1;
			console.log('After: ', likesAmountDictionary);

			//update userlikes
			if (!userLikes.includes(ideaID)) {
				userLikes.push(ideaID);
			}
			console.log(userLikes);
		}

		//snychronise with online
		const formData = new FormData();
		formData.set('ideaID', ideaID);
		formData.set('likedState', String(!oldLikedState)); //invert to set the new state
		console.log('Requesting likeChange', formData);
		try {
			const response = await fetch('/api/ideas/likes', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				// Update the UI based on the response
				console.log('Form submitted successfully', data);
			} else {
				console.error('Failed to submit form', await response.text());
			}
		} catch (error) {
			console.error('Error submitting form', error);
		}
	}
</script>

<!-- {#if !mapModal} -->

<div class="flex flex-col h-full">
	<header id="header">
		<h1 class="text-4xl font-bold p-2 text-center">Eventmaps Ideen</h1>
		<div class="w-100 bg-orange-200 font-bold text-center">
			Hallo {data.userId} !
			<br /> Dies ist eine Testversion. <br /> Die App wird regelmäßig resettet.
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
				{#if !displayArchiv}
					Archiv
				{:else}
					Zurück
				{/if}
			</button>
		</div>
	</header>

	<main class="flex-grow overflow-y-auto flex flex-col gap-2 w-full">
		{#if !displayArchiv}
			{#each eventIdeas as idea (idea.id)}
				<Card
					{idea}
					link={'/details/' + idea.id}
					isLikedbyUser={userLikes.includes(idea.id)}
					likeAmount={getLikeAmount(idea.id, idea)}
					isEnabled={true}
					onLikeClick={handleIdeaLike}
				/>
			{/each}
		{/if}

		{#if displayArchiv}
			{#each archivedEventIdeas as idea (idea.id)}
				<Card
					{idea}
					link={'/details/' + idea.id}
					isLikedbyUser={userLikes.includes(idea.id)}
					likeAmount={getLikeAmount(idea.id, idea)}
					isEnabled={false}
					onLikeClick={() => {}}
				/>
			{/each}
		{/if}
	</main>

	<footer id="footer" class="h-16 w-full flex items-center justify-center">
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
