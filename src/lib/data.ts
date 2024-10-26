import type { EventIdea } from './types';

export const eventIdeas: EventIdea[] = [
	{
		id: '1',
		title: 'Weihnachtsfeier',
		description: 'description description description description description description',
		icon: 'martini',
		likes: 5,
		location: [-122.420679, 37.772537],
		townPrecomputed: 'Zwickau?',
		date: new Date(2022, 5, 12, 14, 30, 0),
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
		townPrecomputed: 'Zwickau?',
		date: new Date(2022, 5, 12, 18, 30, 0),
		visitorAmount: 3,
		priceCents: 100,
		creator: 'user1'
	}
];
