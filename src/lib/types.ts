import type { LngLatLike } from 'maplibre-gl';

export type EventIdea = {
	id: string;
	location: LngLatLike;
	// timeOfDay: Time;
	date: Date;
	visitorAmount: number;
	priceCents: number;
	title: string;
	// limit to like 400-500chars
	description: string;
	// for now just one of the icons, later could be image
	icon: string;
	creator: string;
	likes: number;
};
