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

	function differenceInDays(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const diffInTime = date2.getTime() - date1.getTime();
		return Math.round(diffInTime / oneDay);
	}

	function calcRemainingVotingDays(ideaCreationDate: Date) {
		//console.log(ideaCreationDate);
		let lastVotingDate: Date = new Date(ideaCreationDate);
		lastVotingDate.setDate(lastVotingDate.getDate() + votingDuration);
		//console.log(lastVotingDate);

		let reaminingDays = differenceInDays(new Date(), lastVotingDate);

		if (reaminingDays < 0) {
			reaminingDays = 0;
		}

		return reaminingDays;
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
				🖈 {idea.locationName}
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
		{#if isEnabled}
			<div class="text-gray-400">
				Voting: {calcRemainingVotingDays(idea.creationDate)} Tag(e)
			</div>
		{/if}
	</div>
</div>
