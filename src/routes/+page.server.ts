import { eventIdeas } from '$lib/data';
import type { EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params
}): Promise<{ eventIdeas: EventIdea[] }> => {
	return {
		eventIdeas: new Array(30).fill(eventIdeas).flat()
	};
};
