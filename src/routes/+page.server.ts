import { eventIdeas } from '$lib/data';
import { db } from '$lib/server/db';
import type { EventIdeaTableEntry } from '$lib/server/db/schema';
import type { EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

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
	default: async ({ cookies, request }) => {
		const data = await request.formData();

		console.log(data);

		const icon = data.get('icon');
		if (!icon) {
			return fail(400, { icon, missing: true });
		}

		const title = data.get('title');
		if (!title) {
			return fail(400, { title, missing: true });
		}

		const details = data.get('details');
		if (!details) {
			return fail(400, { details, missing: true });
		}

		const startDate = data.get('startDate');
		if (!startDate) {
			return fail(400, { startDate, missing: true });
		}

		const startTime = data.get('startTime');
		if (!startDate) {
			return fail(400, { startTime, missing: true });
		}

		const endDate = data.get('endDate');
		if (!startDate) {
			return fail(400, { endDate, missing: true });
		}

		const price = data.get('price');
		if (!price) {
			return fail(400, { endDate, missing: true });
		}

		const town = data.get('town');
		if (!town) {
			return fail(400, { town, missing: true });
		}

		const latitude = data.get('latitude');
		if (!latitude) {
			return fail(400, { latitude, missing: true });
		}

		const longitude = data.get('longitude');
		if (!longitude) {
			return fail(400, { longitude, missing: true });
		}

		const visitorAmount = data.get('visitorAmount');
		if (!visitorAmount) {
			return fail(400, { visitorAmount, missing: true });
		}

		console.log('Alles eingelesen.');

		let newEventIdea: EventIdea = {
			id: '3',
			title: title.toString(),
			description: details.toString(),
			icon: icon.toString(),
			likes: 0,
			location: [Number(longitude), Number(latitude)],
			townPrecomputed: town.toString(),
			date: new Date(2022, 5, 12, 14, 30, 0),
			visitorAmount: Number(visitorAmount),
			priceCents: Number(price),
			creator: 'user'
		};

		eventIdeas.push(newEventIdea);
		return { success: true };
	}
};
