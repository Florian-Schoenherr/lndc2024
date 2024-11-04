<script lang="ts">
	import LikeButton from './LikeButton.svelte';
	import { localizations, locationRadiusConstraint, type EventIdea } from '../types';

	export let idea: EventIdea;
	export let link = false;
	export let isLikedbyUser: boolean;

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
	class={'block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ' +
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
			<form method="POST" action="?/changeLikeState">
				<LikeButton click={toggleLike} likes={idea.likes} {isLikedbyUser} />
				<input type="hidden" name="ideaID" value={idea.id} />
				<input type="hidden" name="likedState" value={isLikedbyUser} />
			</form>
		</div>
	</div>

	<div class="flex flex-row w-full gap-5 mt-5 justify-evenly text-xl dark:text-white">
		<div>
			🖈 {idea.locationName}
			+{locationRadiusConstraint[idea.locationRadius].max} m
		</div>
		<div>
			Von: {Intl.DateTimeFormat('de-DE', {
				dateStyle: 'medium'
			}).format(idea.dateRange.minDate)}

			Bis: {Intl.DateTimeFormat('de-DE', {
				dateStyle: 'medium'
			}).format(idea.dateRange.maxDate)}
		</div>
		<div>
			{localizations.emoticon.timeOfDayConstraint[idea.timeOfDay]}
		</div>
		<div>
			{localizations.emoticon.priceConstraint[idea.price]}
		</div>
	</div>
	<slot />
</svelte:element>
