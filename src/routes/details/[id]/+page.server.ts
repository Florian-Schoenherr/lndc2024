import type { EventIdea } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eventIdeas } from '$lib/data';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ url, params }) => {
	// const eventIdea = await db.query.eventidea.findFirst({
	// 	where: (eventidea, { eq }) => eq(eventidea.id, params.id)
	// });
	let eventIdea = eventIdeas.find((idea) => idea.id === params.id);
	if (eventIdea === undefined) {
		error(404, 'Not found');
	}
	return {
		eventIdea
	};
};
