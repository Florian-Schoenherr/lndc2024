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

export const actions = {
	saveEventIdea: async function ({ cookies, request }) {
		// TODO: we could use the normal svelte formdata stuff
		const data = await request.json();

		// const newEventIdea = await db.insert(eventidea).values(data);
		// return { success: true, newEventIdea };
	}
};
