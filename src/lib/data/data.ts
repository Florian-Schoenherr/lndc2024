import type { EventIdea } from '$lib/types';

export const eventIdeas: EventIdea[] = [
	{
		id: '1',
		title: 'Weihnachtsfeier',
		description: 'description description description description description description',
		icon: '🍸',
		likes: 0,
		location: [-122.420679, 37.772537],
		townPrecomputed: 'Zwickau',
		date: new Date(2022, 5, 12, 14, 30, 0),
		visitorAmount: 3,
		priceCents: 100,
		creator: 'user1'
	},
	{
		id: '2',
		title: 'Halloween',
		description: 'description description description description description description',
		icon: '⚽',
		likes: 0,
		location: [-122.420679, 137.772537],
		townPrecomputed: 'Zwickau',
		date: new Date(2022, 5, 12, 18, 30, 0),
		visitorAmount: 3,
		priceCents: 100,
		creator: 'user2'
	}
];

// Define the emoji ranges used in the form inpu
export const emojiRanges = [
	[0x1f600, 0x1f64f], // Emoticons
	[0x1f300, 0x1f5ff], // Miscellaneous Symbols and Pictographs
	[0x1f680, 0x1f6ff], // Transport and Map Symbols
	[0x1f900, 0x1f9ff], // Supplemental Symbols and Pictographs
	[0x1f1e6, 0x1f1ff] // Flags
];
