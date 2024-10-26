import { eventIdeas } from '$lib/data';
import { db } from '$lib/server/db';
import type { EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params
}): Promise<{ eventIdeas: EventIdea[] }> => {
	// const eventIdeas = await db.query.eventIdea.findMany();
	return {
		eventIdeas: new Array(1).fill(eventIdeas).flat()
	};
};
