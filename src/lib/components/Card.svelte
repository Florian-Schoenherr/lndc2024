<script lang="ts">
	import LikeButton from './LikeButton.svelte';
	import { localizations, type EventIdea } from '../types';
	import { votingDuration } from '$lib/data/data';
	import { goto } from '$app/navigation';

	export let idea: EventIdea;
	export let link: string;
	export let isLikedbyUser: boolean = false;
	export let likeAmount: number = 0;
	export let isEnabled: boolean = true;

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault(); // Prevent page reload
		const formData = new FormData(event.target as HTMLFormElement);
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

	function toggleLike(e: Event): void {
		if (isLikedbyUser) {
			isLikedbyUser = false;
			likeAmount--; //do local UI update for likes.
		} else {
			isLikedbyUser = true;
			likeAmount++; //do local UI update for likes.
		}
	}

	function navigateToDetails() {
		if (link) {
			console.log('link clicked');
			goto(link);
		}
	}
</script>

<div class="px-5 py-3 w-100 flex flex-row gap-2">
	<div
		class="flex-grow"
		onclick={navigateToDetails}
		onkeydown={navigateToDetails}
		role="button"
		tabindex="0"
	>
		<div class="flex gap-2 items-center">
			<div class="h-16 w-16 dark:stroke-white align-middle text-5xl">
				{idea.icon}
			</div>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{idea.title}
			</h5>
		</div>

		<div class="flex flex-row justify-between items-center text-xl dark:text-white">
			<div class="text-xl">
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="inline"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M10 11.5C11.933 11.5 13.5 9.933 13.5 8C13.5 6.067 11.933 4.5 10 4.5C8.067 4.5 6.5 6.067 6.5 8C6.5 9.933 8.067 11.5 10 11.5ZM10 6.5C10.8284 6.5 11.5 7.17157 11.5 8C11.5 8.82843 10.8284 9.5 10 9.5C9.17157 9.5 8.5 8.82843 8.5 8C8.5 7.17157 9.17157 6.5 10 6.5Z"
						fill="#000000"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M2.5 8.12313C2.5 12.3656 6.88183 19.5 10 19.5C13.1182 19.5 17.5 12.3656 17.5 8.12313C17.5 3.91715 14.1464 0.5 10 0.5C5.85362 0.5 2.5 3.91715 2.5 8.12313ZM15.5 8.12313C15.5 11.4027 11.7551 17.5 10 17.5C8.24487 17.5 4.5 11.4027 4.5 8.12313C4.5 5.0134 6.96668 2.5 10 2.5C13.0333 2.5 15.5 5.0134 15.5 8.12313Z"
						fill="#000000"
					/>
				</svg>{idea.locationName}
			</div>
			<div class="text-lg">
				{Intl.DateTimeFormat('default', {
					month: 'long'
				}).format(idea.dateRange.minDate)}
				-<br />
				{Intl.DateTimeFormat('default', {
					month: 'long'
				}).format(idea.dateRange.maxDate)}
			</div>
			<div class="text-2xl">
				{localizations.emoticon.timeOfDayConstraint[idea.timeOfDay]}
			</div>
			<div class="text-xl">
				{localizations.emoticon.priceConstraint[idea.price]}
			</div>
		</div>
	</div>

	<div class="w-20 h-full">
		{#if isEnabled}
			<form onsubmit={handleSubmit}>
				<LikeButton click={toggleLike} likes={likeAmount} {isLikedbyUser} />
				<input type="hidden" name="ideaID" value={idea.id} />
				<input type="hidden" name="likedState" value={isLikedbyUser} />
			</form>
		{/if}
		{#if !isEnabled}
			<LikeButton click={() => {}} likes={likeAmount} {isLikedbyUser} />
		{/if}
	</div>
</div>
