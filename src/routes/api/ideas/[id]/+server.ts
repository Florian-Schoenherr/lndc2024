import { eventIdeas, archivedEventIdeas } from '$lib/data/data';

import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	// const eventIdea = await db.query.eventidea.findFirst({
	// 	where: (eventidea, { eq }) => eq(eventidea.id, params.id)
	// });

	let eventIdea = eventIdeas.find((idea) => idea.id === params.id);

	if (!eventIdea) {
		eventIdea = archivedEventIdeas.find((idea) => idea.id === params.id);
	}

	if (!eventIdea) {
		error(404, 'Not found');
	}
	return json(eventIdea, { status: 201 });
}
