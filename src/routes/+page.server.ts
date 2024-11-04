import { emojiRanges, eventIdeas } from '$lib/data/data';
import { db } from '$lib/server/db';
import { user, type EventIdeaTableEntry } from '$lib/server/db/schema';
import {
	GroupSize,
	LocationRadius,
	Price,
	TimeOfDay,
	TimeOfDayOption,
	type EventIdea
} from '$lib/types';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { v6 as uuidv6 } from 'uuid';

let nextClientCookieId: number = 1;
let persistedLikesPerUser; //{userID: ["ideaID1","ideaId2"]} // 2: ["1"]}

function isEmoji(char) {
	const codePoint = char.codePointAt(0); //get codepoint of first char.
	console.log(`Checked char ${codePoint}`);
	return emojiRanges.some(([start, end]) => codePoint >= start && codePoint <= end);
}

function mapStringToEnum(input, enumType) {
	const enumValue = enumType[input];
	if (!enumValue) {
		throw new Error(
			`Invalid enum value ${input} for ${enumType}. Must be one of: ${Object.keys(enumType).join(', ')}`
		);
	}
	return enumValue;
}

export const load: PageServerLoad = async ({
	url,
	params,
	cookies
}): Promise<{ clientId: number; eventIdeas: EventIdea[]; likedEventIds: string[] }> => {
	// const eventIdeas = await db.query.eventIdea.findMany();

	let expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 1000);

	let clientCookieId: number = Number(cookies.get('clientID'));
	console.log(`Loaded clientID ${clientCookieId} from cookie...`);

	if (!clientCookieId) {
		clientCookieId = nextClientCookieId;
		cookies.set('clientID', nextClientCookieId.toString(), {
			path: '/',
			expires: expirationDate,
			secure: false
		});
		console.log(`Set clientID via Cookie ${clientCookieId}`);
		nextClientCookieId++;
	} else {
		if (clientCookieId >= nextClientCookieId) {
			nextClientCookieId = clientCookieId + 1;
			console.log(`Increased nextClientID to ${nextClientCookieId}`);
		}

		cookies.set('clientID', clientCookieId.toString(), {
			path: '/',
			expires: expirationDate,
			secure: false
		});
		console.log(`Renewed experiation Date of Cookie "clientID":${clientCookieId}.`);
	}

	///// Load persisted data for user //////////////
	//transmit to the page which ideas the user had already liked.
	if (!persistedLikesPerUser) {
		persistedLikesPerUser = {};
	}

	let currentUsersLikedIdeaIds = [];
	if (persistedLikesPerUser[clientCookieId]) {
		currentUsersLikedIdeaIds = persistedLikesPerUser[clientCookieId];
	}

	//caclulate the total sum of likes for each idea by iterating over all users.
	let allLikeEntries = [];
	allLikeEntries = Object.values(persistedLikesPerUser);

	let combinedLikeEntries: string[] = allLikeEntries.flat();
	console.log(`All persisted Like Entries: ${combinedLikeEntries}.`);

	eventIdeas.forEach((idea) => {
		let allEntriesForIdeaID = combinedLikeEntries.filter((entry) => entry === idea.id);
		if (allEntriesForIdeaID) {
			idea.likes = allEntriesForIdeaID.length;
			console.log(`For Idea with ID ${idea.id} we restored ${allEntriesForIdeaID.length} likes.`);
		} else {
			idea.likes = 0;
		}
	});

	//console.log('Reloading page.');
	//console.log('Event ideas: ');
	//console.log(eventIdeas);

	//Sort entires by likes
	eventIdeas.sort((idea1, idea2) => {
		if (idea1.likes === idea2.likes) {
			return 0;
		}
		if (idea1.likes < idea2.likes) {
			return 1;
		}
		return -1;
	});

	return {
		clientId: clientCookieId,
		eventIdeas: eventIdeas,
		likedEventIds: currentUsersLikedIdeaIds
	};
};

export const actions = {
	submitIdea: async ({ cookies, request }) => {
		// Validation helper function
		const validateField = (fieldName, fieldValue) => {
			if (!fieldValue) {
				return fail(400, { [fieldName]: fieldValue, missing: true });
			}
		};

		let userID = cookies.get('clientID');

		if (!userID) {
			console.log(`userID ${userID} was not set..,`);
			return fail(400, { userID, missing: true });
		}

		console.log(`Submitting like action with userID ${userID}`);

		if (!persistedLikesPerUser[userID]) {
			persistedLikesPerUser[userID] = [];
		}

		const data = await request.formData();
		console.log(data);

		// Validate required fields
		validateField('icon', data.get('icon'));
		const icon = data.get('icon');

		if (!isEmoji(icon)) {
			return fail(400, { icon, invalid: true });
		}

		const title = data.get('title');
		validateField('title', title);
		const description = data.get('description');
		validateField('description', description);
		const startDate = data.get('startDate');
		validateField('startDate', startDate);
		const startTime = data.get('startTime');
		validateField('startTime', startTime);
		const endDate = data.get('endDate');
		validateField('endDate', endDate);
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

		const uuid = uuidv6();

		let newEventIdea = {
			id: uuid,
			creatorId: userID,
			likes: 0,
			title: title?.toString(),
			icon: icon?.toString(),
			description: description?.toString(),
			timeOfDay: timeOfDay,
			groupSize: groupSize,
			price: price,
			dateRange: {
				startDate: new Date(2024, 12, 10, 0, 0, 0),
				endDate: new Date(2024, 12, 12, 0, 0, 0)
			},
			locationRadius: locationRadius,
			locationCoordinates: [-122.420679, 37.772537],
			locationName: 'Zwickau'
		};

		// Push the new event idea to your storage
		eventIdeas.push(newEventIdea);
		return { success: true };
	},
	changeLikeState: async ({ cookies, request }) => {
		console.log('AddLike');

		const data = await request.formData();
		console.log(data);

		//const userID = data.get('userID');
		//if (!userID) {
		//	return fail(400, { userID, missing: true });
		//}
		const ideaID = data.get('ideaID');
		if (!ideaID) {
			return fail(400, { ideaID, missing: true });
		}
		const likedState = data.get('likedState');
		if (!likedState) {
			return fail(400, { likedState, missing: true });
		}

		let userID = cookies.get('clientID');

		if (!userID) {
			console.log(`userID ${userID} was not set..,`);
			return fail(400, { userID, missing: true });
		}

		console.log(`Submitting like action with userID ${userID}`);

		if (!persistedLikesPerUser[userID]) {
			persistedLikesPerUser[userID] = [];
		}

		// Read form dat
		if (likedState.toString() === 'true') {
			//Add Likes
			console.log('Called add Like');
			let persistedLikes = persistedLikesPerUser[userID.toString()];
			if (persistedLikes) {
				persistedLikes.push(ideaID.toString());
				persistedLikesPerUser[userID.toString()] = persistedLikes;
			}
		} else {
			//Remove Likes
			let persistedLikes = persistedLikesPerUser[userID.toString()];
			if (persistedLikes) {
				const index = persistedLikes.indexOf(ideaID.toString(), 0);
				if (index > -1) {
					persistedLikes.splice(index, 1);
					persistedLikesPerUser[userID.toString()] = persistedLikes;
				}
			}
		}
		return { success: true };
	}
};
