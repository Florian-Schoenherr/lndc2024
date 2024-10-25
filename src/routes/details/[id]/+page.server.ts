import type { EventIdea } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eventIdeas } from '$lib/data';

export const load: PageServerLoad = async ({ url, params }) => {
	let eventIdea = eventIdeas.find((idea) => idea.id === params.id);
	if (eventIdea === undefined) {
		error(404, 'Not found');
	}
	return {
		eventIdea
	};
};
