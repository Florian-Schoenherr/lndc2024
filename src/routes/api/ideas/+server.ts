import { eventIdeas, iconRanges } from '$lib/data/data';
import { fail, json, redirect } from '@sveltejs/kit';
import { v6 as uuidv6 } from 'uuid';

function isIcon(char) {
	const codePoint = char.codePointAt(0); //get codepoint of first char.
	console.log(`Checked char ${codePoint}`);
	return iconRanges.some(([start, end]) => codePoint >= start && codePoint <= end);
}

function validateField(fieldName, fieldValue) {
	if (!fieldValue) {
		return fail(400, { [fieldName]: fieldValue, missing: true });
	}
}

/*
// TODO: we could use the normal svelte formdata stuff
export async function POST({ request, cookies }) {
	const userid = cookies.get('userid');
	console.log(userid);

	const data: EventIdea = await request.json();
	console.log(data);
	const entry: EventIdeaTableEntry = {
		date: data.date,
		id: data.id,
		title: data.title,
		description: data.description,
		icon: data.icon,
		likes: data.likes,
		townPrecomputed: data.townPrecomputed,
		location: data.location.toString(),
		visitorAmount: data.visitorAmount,
		priceCents: data.priceCents,
		creator: data.creator
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
	const data = await request.formData();
	console.log(data);

	// Validate required fields
	validateField('icon', data.get('icon'));
	const icon = data.get('icon');

	if (!isIcon(icon)) {
		return fail(400, { icon, invalid: true });
	}

	const title = data.get('title');
	validateField('title', title);
	const description = data.get('description');
	validateField('description', description);
	const minDate = data.get('minDate');
	validateField('minDate', minDate);
	const maxDate = data.get('maxDate');
	validateField('maxDate', maxDate);
	const town = data.get('town');
	validateField('town', town);
	const latitude = data.get('latitude');
	validateField('latitude', latitude);
	const longitude = data.get('longitude');
	validateField('longitude', longitude);

	// Derive enums from the form data
	const timeOfDay = data.get('timeOfDay'); // Assuming the user inputs this
	validateField('timeOfDay', timeOfDay);

	const groupSize = data.get('groupSize'); // Assuming the user inputs this
	validateField('groupSize', groupSize);

	const price = data.get('price'); // Assuming the user inputs this
	validateField('price', price);

	const locationRadius = data.get('locationRadius'); // Assuming the user inputs this
	validateField('locationRadius', locationRadius);

	console.log('All data read successfully.');

	let newEventIdea = {
		id: uuidv6(),
		creatorId: userID,
		title: title?.toString(),
		icon: icon?.toString(),
		description: description?.toString(),
		timeOfDay: timeOfDay,
		groupSize: groupSize,
		price: price,
		dateRange: {
			minDate: minDate,
			maxDate: maxDate
		},
		locationRadius: locationRadius,
		locationCoordinates: [latitude, longitude],
		locationName: 'Zwickau'
	};

	// Push the new event idea to your storage
	eventIdeas.push(newEventIdea);
	return redirect(303, '/');
}
