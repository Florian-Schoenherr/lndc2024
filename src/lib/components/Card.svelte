<script lang="ts">
	import LikeButton from './LikeButton.svelte';
	import { localizations, locationRadiusConstraint, type EventIdea } from '../types';

	export let idea: EventIdea;
	export let link = false;
	export let isLikedbyUser: boolean = false;
	export let likeAmount: number = 0;

	function toggleLike(e: Event): void {
		if (isLikedbyUser) {
			isLikedbyUser = false;
		} else {
			isLikedbyUser = true;
		}
	}
</script>

<svelte:element
	this={link ? 'div' : 'div'}
	class={'block px-5 py-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ' +
		(link ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : '')}
>
	<div class="flex gap-2 items-center">
		<div class="h-16 w-16 dark:stroke-white align-middle text-5xl">
			{idea.icon}
		</div>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{idea.title}
		</h5>
		<div class="ml-auto">
			<form method="POST" action="api/ideas/likes">
				<LikeButton click={toggleLike} likes={likeAmount} {isLikedbyUser} />
				<input type="hidden" name="ideaID" value={idea.id} />
				<input type="hidden" name="likedState" value={isLikedbyUser} />
			</form>
		</div>
	</div>

	<div class="px-3 flex flex-row w-full justify-between items-center text-xl dark:text-white cent">
		<div class="text-2xl">
			🖈 {idea.locationName}
		</div>
		<div>
			{Intl.DateTimeFormat('default', {
				month: 'long'
			}).format(idea.dateRange.minDate)}
			-<br />
			{Intl.DateTimeFormat('default', {
				month: 'long'
			}).format(idea.dateRange.maxDate)}
		</div>
		<div class="text-3xl">
			{localizations.emoticon.timeOfDayConstraint[idea.timeOfDay]}
		</div>
		<div class="text-2xl">
			{localizations.emoticon.priceConstraint[idea.price]}
		</div>
	</div>
	<slot />
</svelte:element>
