import { archivedEventIdeas, eventIdeas, iconRanges, votingDuration } from '$lib/data/data';
import {
	GroupSizeOption,
	LocationRadiusOption,
	PriceOption,
	TimeOfDayOption,
	type EventIdea
} from '$lib/types.js';
import { fail, json, redirect } from '@sveltejs/kit';
import { v6 as uuidv6 } from 'uuid';

// Set an interval to check all ideas every N seconds about the voting time.
const MOVE_FINISHED_VOTING_INTERVAL = 60 * 60; // 1h

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

function differenceInDays(date1: Date, date2: Date): number {
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	const diffInTime = date2.getTime() - date1.getTime();
	return Math.round(diffInTime / oneDay);
}

function calcRemainingVotingDays(ideaCreationDate: Date) {
	//console.log(ideaCreationDate);
	let lastVotingDate: Date = new Date(ideaCreationDate);
	lastVotingDate.setDate(lastVotingDate.getDate() + votingDuration);
	//console.log(lastVotingDate);

	let reaminingDays = differenceInDays(new Date(), lastVotingDate);

	if (reaminingDays < 0) {
		reaminingDays = 0;
	}

	return reaminingDays;
}

function sortIdeasToArchivedByVotingState() {
	const now = Date.now();
	//function to divide the ideas into active and archived ideas. Archived = voting time over
	let expiredVoteIdeas = eventIdeas.filter((idea) => {
		if (calcRemainingVotingDays(idea.creationDate) <= 0) {
			archivedEventIdeas.push(idea); // Move to archived list
			return true;
		}
		return false;
	});

	expiredVoteIdeas.forEach((ideaToRemove) => {
		let index = eventIdeas.findIndex((idea) => idea.id === ideaToRemove.id);
		if (index) {
			eventIdeas.splice(index, 1);
		}
	});
	console.log(`SERVER: Moved ${expiredVoteIdeas.length} ideas to archived...`);
}

sortIdeasToArchivedByVotingState();
setInterval(sortIdeasToArchivedByVotingState, MOVE_FINISHED_VOTING_INTERVAL);

/*
// TODO: we could use the normal svelte formformData stuff
export async function POST({ request, cookies }) {
	const userid = cookies.get('userid');
	console.log(userid);

	const formData: EventIdea = await request.json();
	console.log(formData);
	const entry: EventIdeaTableEntry = {
		date: formData.date,
		id: formData.id,
		title: formData.title,
		description: formData.description,
		icon: formData.icon,
		likes: formData.likes,
		townPrecomputed: formData.townPrecomputed,
		location: formData.location.toString(),
		visitorAmount: formData.visitorAmount,
		priceCents: formData.priceCents,
		creator: formData.creator
	};
	const newEventIdea = await db.insert(eventidea).values(entry);
	// return { success: true, newEventIdea };

	return json({ newEventIdea }, { status: 201 });
}
*/

export async function GET() {
	return json(eventIdeas, { status: 201 });
}

export async function POST({ cookies, request }) {
	let userID = cookies.get('clientID');

	if (!userID) {
		console.log(`userID was not set..,`);
		return fail(400, { userID, missing: true });
	}

	console.log(`Submitting idea via form and ${userID}`);
	const formData = await request.formData();
	console.log(formData);

	//// Validate required fields
	//Validate if missing
	let iconData = formData.get('icon');
	throwErrorIfMissing('icon', iconData);

	let titleData = formData.get('title');
	throwErrorIfMissing('title', titleData);

	let descriptionData = formData.get('description');
	throwErrorIfMissing('description', descriptionData);

	let minDateData = formData.get('minDate');
	throwErrorIfMissing('minDate', minDateData);

	let maxDateData = formData.get('maxDate');
	throwErrorIfMissing('maxDate', maxDateData);

	let townData = formData.get('town');
	throwErrorIfMissing('town', townData);

	let latitudeData = formData.get('latitude');
	throwErrorIfMissing('latitude', latitudeData);

	let longitudeData = formData.get('longitude');
	throwErrorIfMissing('longitude', longitudeData);

	// Derive enums from the form formData
	let timeOfDayData = formData.get('timeOfDay'); // Assuming the user inputs this
	throwErrorIfMissing('timeOfDay', timeOfDayData);

	let groupSizeData = formData.get('groupSize'); // Assuming the user inputs this
	throwErrorIfMissing('groupSize', groupSizeData);

	let priceData = formData.get('price'); // Assuming the user inputs this
	throwErrorIfMissing('price', priceData);

	let locationRadiusData = formData.get('locationRadius'); // Assuming the user inputs this
	throwErrorIfMissing('locationRadius', locationRadiusData);

	console.log('All required form data was received and read .');

	//Validate values
	let icon: string = iconData?.toString();
	if (!isIcon(icon)) {
		return fail(400, { iconData, invalid: true });
	}

	let title: string = titleData?.toString();
	console.log(title);

	if (title.length < 1 || title.length > 256) {
		return fail(400, { titleData, invalid: true });
	}

	let description: string = descriptionData?.toString();
	if (description.length < 1 || description.length > 1024) {
		return fail(400, { descriptionData, invalid: true });
	}

	let minDate: Date = new Date(minDateData);
	if (!minDate) {
		return fail(400, { minDateData, invalid: true });
	}

	let maxDate: Date = new Date(maxDateData);
	if (!maxDate || maxDate < minDate) {
		return fail(400, { maxDateData, invalid: true });
	}

	let town: string = townData?.toString();
	if (town.length < 1 || town.length > 256) {
		return fail(400, { townData, invalid: true });
	}

	let latitude: number = Number(latitudeData);
	if (latitude === undefined) {
		return fail(400, { latitudeData, invalid: true });
	}

	let longitude: number = Number(longitudeData);
	if (longitude === undefined) {
		return fail(400, { longitudeData, invalid: true });
	}

	// ENUMS, derive it from the form Data
	let timeOfDay: TimeOfDayOption = Number(timeOfDayData);
	if (timeOfDay === undefined) {
		return fail(400, { timeOfDayData, invalid: true });
	}

	let groupSize: GroupSizeOption = Number(groupSizeData);
	if (groupSize === undefined) {
		return fail(400, { groupSizeData, invalid: true });
	}

	let price: PriceOption = Number(priceData);
	if (price === undefined) {
		return fail(400, { priceData, invalid: true });
	}

	let locationRadius: LocationRadiusOption = Number(locationRadiusData);
	if (locationRadius === undefined) {
		return fail(400, { locationRadiusData, invalid: true });
	}

	let newEventIdea = {
		id: uuidv6(),
		creatorId: userID,
		creationDate: new Date(),
		title: title,
		icon: icon,
		description: description,
		timeOfDay: timeOfDay,
		groupSize: groupSize,
		price: price,
		dateRange: {
			minDate: minDate,
			maxDate: maxDate
		},
		locationRadius: locationRadius,
		locationCoordinates: [latitude, longitude],
		locationName: town
	} as EventIdea;

	// Push the new event idea to your storage
	eventIdeas.push(newEventIdea);
	return new Response(
		JSON.stringify({
			message: 'Idea successfully submited.'
		}),
		{ status: 200, headers: { 'Content-Type': 'application/json' } }
	);
}
