import type { EventIdea } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params,
	fetch
}): Promise<{
	eventIdea: EventIdea;
}> => {
	// const eventIdea = await db.query.eventidea.findFirst({
	// 	where: (eventidea, { eq }) => eq(eventidea.id, params.id)
	// });

	////Fetch eventIdea
	const eventIdeaResponse = await fetch(`/api/ideas/${params.id}`);

	if (!eventIdeaResponse) {
		return error(404, `No eventIdea with ID ${params.id} found`);
	}
	let eventIdea: EventIdea = await eventIdeaResponse.json();
	//console.log(eventIdea);

	eventIdea = {
		...eventIdea,
		dateRange: {
			minDate: new Date(eventIdea.dateRange.minDate),
			maxDate: new Date(eventIdea.dateRange.maxDate)
		}
	};

	console.log(eventIdea);

	return {
		eventIdea: eventIdea
	};
};
