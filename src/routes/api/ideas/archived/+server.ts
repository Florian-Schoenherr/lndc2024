import { archivedEventIdeas, iconRanges } from '$lib/data/data';
import {
	GroupSizeOption,
	LocationRadiusOption,
	PriceOption,
	TimeOfDayOption,
	type EventIdea
} from '$lib/types.js';
import { fail, json } from '@sveltejs/kit';
import { v6 as uuidv6 } from 'uuid';

function isIcon(char) {
	const codePoint = char.codePointAt(0); //get codepoint of first char.
	console.log(`Checked char ${codePoint}`);
	return iconRanges.some(([start, end]) => codePoint >= start && codePoint <= end);
}

function throwErrorIfMissing(fieldName, fieldValue) {
	if (!fieldValue) {
		return fail(400, { [fieldName]: fieldValue, missing: true });
	}
}

export async function GET() {
	return json(archivedEventIdeas, { status: 201 });
}
