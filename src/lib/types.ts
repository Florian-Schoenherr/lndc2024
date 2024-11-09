import type { LngLatLike } from 'maplibre-gl';

export enum LocationRadiusOption {
	VerySmall,
	Small,
	Medium,
	Large,
	VeryLarge
}

export enum TimeOfDayOption {
	EarlyMorning,
	Morning,
	ForeNoon,
	Midday,
	Afternoon,
	Evening,
	Night
}

export enum GroupSizeOption {
	VerySmall,
	Small,
	Medium,
	Large,
	VeryLarge
}

export enum PriceOption {
	VeryCheap,
	Cheap,
	Moderate,
	Expensive,
	VeryExpensive
}

export type IdeaConstraintBoundary<T> = {
	min: T;
	max: T;
};

export type IdeaConstraint<T, U> = {
	[key in T]: IdeaConstraintBoundary<U>;
};

export type IdeaConstraintLocalization<T> = {
	[key in T]: string;
};

export const priceConstraint: IdeaConstraint<PriceOption, number> = {
	[PriceOption.VeryCheap]: { min: 0, max: 10 },
	[PriceOption.Cheap]: { min: 10, max: 20 },
	[PriceOption.Moderate]: { min: 20, max: 100 },
	[PriceOption.Expensive]: { min: 100, max: 300 },
	[PriceOption.VeryExpensive]: { min: 300, max: 1000 }
};

export const groupSizeConstraint: IdeaConstraint<GroupSizeOption, number> = {
	[GroupSizeOption.VerySmall]: { min: 0, max: 10 },
	[GroupSizeOption.Small]: { min: 11, max: 50 },
	[GroupSizeOption.Medium]: { min: 51, max: 200 },
	[GroupSizeOption.Large]: { min: 201, max: 500 },
	[GroupSizeOption.VeryLarge]: { min: 501, max: 5000 }
};

export const locationRadiusConstraint: IdeaConstraint<LocationRadiusOption, number> = {
	[LocationRadiusOption.VerySmall]: { min: 0, max: 100 },
	[LocationRadiusOption.Small]: { min: 0, max: 500 },
	[LocationRadiusOption.Medium]: { min: 0, max: 1000 },
	[LocationRadiusOption.Large]: { min: 0, max: 5000 },
	[LocationRadiusOption.VeryLarge]: { min: 0, max: 10000 }
};

export const timeOfDayConstraint: IdeaConstraint<TimeOfDayOption, Date> = {
	[TimeOfDayOption.EarlyMorning]: { min: createBoundaryTime(0, 0), max: createBoundaryTime(3, 59) },
	[TimeOfDayOption.Morning]: { min: createBoundaryTime(4, 0), max: createBoundaryTime(7, 59) },
	[TimeOfDayOption.ForeNoon]: { min: createBoundaryTime(8, 0), max: createBoundaryTime(11, 59) },
	[TimeOfDayOption.Midday]: { min: createBoundaryTime(12, 0), max: createBoundaryTime(13, 59) },
	[TimeOfDayOption.Afternoon]: { min: createBoundaryTime(14, 0), max: createBoundaryTime(17, 59) },
	[TimeOfDayOption.Evening]: { min: createBoundaryTime(18, 0), max: createBoundaryTime(21, 59) },
	[TimeOfDayOption.Night]: { min: createBoundaryTime(22, 0), max: createBoundaryTime(23, 59) }
};

export const localizations = {
	en: {
		timeOfDayConstraint: {
			[TimeOfDayOption.EarlyMorning]: 'early morning',
			[TimeOfDayOption.Morning]: 'morning',
			[TimeOfDayOption.ForeNoon]: 'forenoon',
			[TimeOfDayOption.Midday]: 'midday',
			[TimeOfDayOption.Afternoon]: 'afternoon',
			[TimeOfDayOption.Evening]: 'evening',
			[TimeOfDayOption.Night]: 'night'
		} as IdeaConstraintLocalization<TimeOfDayOption>,
		locationRadiusConstraint: {
			[LocationRadiusOption.VerySmall]: 'very small',
			[LocationRadiusOption.Small]: 'small',
			[LocationRadiusOption.Medium]: 'medium',
			[LocationRadiusOption.Large]: 'large',
			[LocationRadiusOption.VeryLarge]: 'very large'
		} as IdeaConstraintLocalization<LocationRadiusOption>,
		priceConstraint: {
			[PriceOption.VeryCheap]: 'very cheap',
			[PriceOption.Cheap]: 'cheap',
			[PriceOption.Moderate]: 'moderate',
			[PriceOption.Expensive]: 'expensive',
			[PriceOption.VeryExpensive]: 'very expensive'
		} as IdeaConstraintLocalization<PriceOption>,
		groupSizeConstraint: {
			[GroupSizeOption.VerySmall]: 'very small',
			[GroupSizeOption.Small]: 'small',
			[GroupSizeOption.Medium]: 'medium',
			[GroupSizeOption.Large]: 'large',
			[GroupSizeOption.VeryLarge]: 'very large'
		} as IdeaConstraintLocalization<GroupSizeOption>
	},
	de: {
		timeOfDayConstraint: {
			[TimeOfDayOption.EarlyMorning]: 'früher Morgen',
			[TimeOfDayOption.Morning]: 'Morgen',
			[TimeOfDayOption.ForeNoon]: 'Vormittag',
			[TimeOfDayOption.Midday]: 'Mittag',
			[TimeOfDayOption.Afternoon]: 'Nachmittag',
			[TimeOfDayOption.Evening]: 'Abend',
			[TimeOfDayOption.Night]: 'Nacht'
		} as IdeaConstraintLocalization<TimeOfDayOption>,
		locationRadiusConstraint: {
			[LocationRadiusOption.VerySmall]: 'sehr klein',
			[LocationRadiusOption.Small]: 'klein',
			[LocationRadiusOption.Medium]: 'mittel',
			[LocationRadiusOption.Large]: 'weit',
			[LocationRadiusOption.VeryLarge]: 'sehr weit'
		} as IdeaConstraintLocalization<LocationRadiusOption>,
		priceConstraint: {
			[PriceOption.VeryCheap]: 'sehr günstig',
			[PriceOption.Cheap]: 'günstig',
			[PriceOption.Moderate]: 'moderat',
			[PriceOption.Expensive]: 'teuer',
			[PriceOption.VeryExpensive]: 'sehr teuer'
		} as IdeaConstraintLocalization<PriceOption>,
		groupSizeConstraint: {
			[GroupSizeOption.VerySmall]: 'sehr klein',
			[GroupSizeOption.Small]: 'klein',
			[GroupSizeOption.Medium]: 'mittel',
			[GroupSizeOption.Large]: 'groß',
			[GroupSizeOption.VeryLarge]: 'sehr groß'
		} as IdeaConstraintLocalization<GroupSizeOption>
	},
	emoticon: {
		timeOfDayConstraint: {
			[TimeOfDayOption.EarlyMorning]: '🌝',
			[TimeOfDayOption.Morning]: '🌅',
			[TimeOfDayOption.ForeNoon]: '🏙️',
			[TimeOfDayOption.Midday]: '🌞',
			[TimeOfDayOption.Afternoon]: '🫖',
			[TimeOfDayOption.Evening]: '🌆',
			[TimeOfDayOption.Night]: '🌃'
		} as IdeaConstraintLocalization<TimeOfDayOption>,
		locationRadiusConstraint: {
			[LocationRadiusOption.VerySmall]: '🖈',
			[LocationRadiusOption.Small]: '🖈🖈',
			[LocationRadiusOption.Medium]: '🖈🖈🖈',
			[LocationRadiusOption.Large]: '🖈🖈🖈🖈',
			[LocationRadiusOption.VeryLarge]: '🖈🖈🖈🖈🖈'
		} as IdeaConstraintLocalization<LocationRadiusOption>,
		priceConstraint: {
			[PriceOption.VeryCheap]: '€',
			[PriceOption.Cheap]: '€€',
			[PriceOption.Moderate]: '€€€',
			[PriceOption.Expensive]: '€€€€',
			[PriceOption.VeryExpensive]: '€€€€€'
		} as IdeaConstraintLocalization<PriceOption>,
		groupSizeConstraint: {
			[GroupSizeOption.VerySmall]: '🧍',
			[GroupSizeOption.Small]: '🧍🧍',
			[GroupSizeOption.Medium]: '🧍🧍🧍',
			[GroupSizeOption.Large]: '🧍🧍🧍🧍',
			[GroupSizeOption.VeryLarge]: '🧍🧍🧍🧍🧍'
		} as IdeaConstraintLocalization<GroupSizeOption>
	}
};

//Function to create the Date Limits via Date Obect.
function createBoundaryTime(hour: number, minute: number): Date {
	const date = new Date();
	date.setHours(hour, minute, 0, 0);
	return date;
}

export class EventIdea {
	id: string;
	creatorId: string;

	title: string;
	icon: string;
	description: string;
	timeOfDay: TimeOfDayOption;
	groupSize: GroupSizeOption;
	price: PriceOption;
	dateRange: { minDate: Date; maxDate: Date };

	locationRadius: LocationRadiusOption;
	locationCoordinates: LngLatLike;
	locationName: string;

	constructor(
		id: string,
		creatorId: string,
		title: string,
		icon: string,
		description: string,
		timeOfDay: TimeOfDayOption,
		groupSize: GroupSizeOption,
		price: PriceOption,
		dateRange: { minDate: Date; maxDate: Date },
		locationCoordinates: { lat: number; lng: number },
		locationName: string,
		locationRadius: LocationRadiusOption
	) {
		this.id = id;
		this.locationCoordinates = locationCoordinates;
		this.locationName = locationName;
		this.creatorId = creatorId;
		this.title = title;
		this.icon = icon;
		this.description = description;
		this.timeOfDay = timeOfDay;
		this.groupSize = groupSize;
		this.price = price;
		this.dateRange = dateRange;
		this.locationRadius = locationRadius;
	}
}

function isWthinGroupSizeRange(wishedGroupSize: number, groupSizeOption: GroupSizeOption): boolean {
	const range = groupSizeConstraint[groupSizeOption];
	return wishedGroupSize >= range.min && wishedGroupSize <= range.max;
}

function isWithinPriceRange(wishedPrice: number, priceOption: PriceOption): boolean {
	const range = priceConstraint[priceOption];
	return wishedPrice >= range.min && wishedPrice <= range.max;
}

function isWithinTimeRange(wishedTime: Date, TimeOfDayOption: TimeOfDayOption): boolean {
	const range = timeOfDayConstraint[TimeOfDayOption];
	return wishedTime >= range.min && wishedTime <= range.max;
}

// Beispiel für eine Funktion zur Radius-Validierung
function isWithinDistanceRange(wishedDistance: number, radius: LocationRadiusOption): boolean {
	const distanceRange = locationRadiusConstraint[radius];
	return wishedDistance >= distanceRange.min && wishedDistance <= distanceRange.max;
}

export type LikeDictionary = {
	[key: string]: string[]; //key: objectID, value: list of liking users identified by ID
};
