import type { EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params
}): Promise<{ eventIdeas: EventIdea[] }> => {
	return {
		eventIdeas: [
			{
				id: '1',
				title: 'Weihnachtsfeier',
				description: 'description description description description description description',
				icon: 'martini',
				likes: 5,
				location: [-122.420679, 37.772537],
				date: new Date('2022-10-25'),
				visitorAmount: 3,
				priceCents: 100,
				creator: 'user'
			},
			{
				id: '2',
				title: 'Halloween',
				description: 'description description description description description description',
				icon: 'martini',
				likes: 10,
				location: [-122.420679, 137.772537],
				date: new Date('2022-10-25'),
				visitorAmount: 3,
				priceCents: 100,
				creator: 'user1'
			}
		]
	};
};
