import {
	GroupSizeOption,
	LocationRadiusOption,
	PriceOption,
	TimeOfDayOption,
	type EventIdea
} from '$lib/types';

export const likeDictionary: LikeDictionary = {
	'1': ['user1', 'user2'],
	'2': ['user1']
};

export const votingDuration: number = 10; //votingDurationDays

export const archivedEventIdeas: EventIdea[] = [];

export const eventIdeas: EventIdea[] = [
	{
		id: '1',
		creatorId: 'user1',
		creationDate: new Date(),
		title: 'Weihnachtsfeier',
		icon: '🍸',
		description: 'HoHoHo',
		timeOfDay: TimeOfDayOption.Evening,
		groupSize: GroupSizeOption.Medium,
		price: PriceOption.VeryCheap,
		dateRange: {
			minDate: new Date(2024, 12, 10, 0, 0, 0),
			maxDate: new Date(2024, 12, 12, 0, 0, 0)
		},
		locationRadius: LocationRadiusOption.Small,
		locationCoordinates: [-122.420679, 37.772537],
		locationName: 'Zwickau'
	},
	{
		id: '2',
		creatorId: 'user2',
		creationDate: new Date(2024, 9, 13, 0, 0, 0),
		title: 'Haloween Kicker',
		icon: '⚽',
		description: 'Huuuuhhuuuu',
		timeOfDay: TimeOfDayOption.Evening,
		groupSize: GroupSizeOption.Medium,
		price: PriceOption.VeryCheap,
		dateRange: {
			minDate: new Date(2024, 12, 13, 0, 0, 0),
			maxDate: new Date(2024, 12, 14, 0, 0, 0)
		},
		locationRadius: LocationRadiusOption.Small,
		locationCoordinates: [-122.420679, 137.772537],
		locationName: 'Zwickau'
	}
];

// Define the emoji ranges used in the form inpu
export const iconRanges = [
	[0x1f600, 0x1f64f], // Emoticons
	[0x1f300, 0x1f5ff], // Miscellaneous Symbols and Pictographs
	[0x1f680, 0x1f6ff], // Transport and Map Symbols
	[0x1f900, 0x1f9ff], // Supplemental Symbols and Pictographs
	[0x1f1e6, 0x1f1ff] // Flags
];
