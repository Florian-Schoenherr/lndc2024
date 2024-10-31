import { emojiRanges, eventIdeas } from '$lib/data/data';
import { db } from '$lib/server/db';
import { user, type EventIdeaTableEntry } from '$lib/server/db/schema';
import type { EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

let nextClientCookieId: number = 1;
let persistedLikesPerUser; //{userID: ["ideaID1","ideaId2"]} // 2: ["1"]}

function isEmoji(char) {
	const codePoint = char.codePointAt(0); //get codepoint of first char.
	console.log(`Checked char ${codePoint}`);
	return emojiRanges.some(([start, end]) => codePoint >= start && codePoint <= end);
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

		const icon = data.get('icon');
		if (!icon || !isEmoji(icon)) {
			return fail(400, { icon, missing: true });
		}

		const title = data.get('title');
		if (!title) {
			return fail(400, { title, missing: true });
		}

		const details = data.get('details');
		if (!details) {
			return fail(400, { details, missing: true });
		}

		const startDate = data.get('startDate');
		if (!startDate) {
			return fail(400, { startDate, missing: true });
		}

		const startTime = data.get('startTime');
		if (!startDate) {
			return fail(400, { startTime, missing: true });
		}

		const endDate = data.get('endDate');
		if (!startDate) {
			return fail(400, { endDate, missing: true });
		}

		const price = data.get('price');
		if (!price) {
			return fail(400, { endDate, missing: true });
		}

		const town = data.get('town');
		if (!town) {
			return fail(400, { town, missing: true });
		}

		const latitude = data.get('latitude');
		if (!latitude) {
			return fail(400, { latitude, missing: true });
		}

		const longitude = data.get('longitude');
		if (!longitude) {
			return fail(400, { longitude, missing: true });
		}

		const visitorAmount = data.get('visitorAmount');
		if (!visitorAmount) {
			return fail(400, { visitorAmount, missing: true });
		}

		console.log('Alles eingelesen.');

		let uuid = uuidv6();

		let newEventIdea: EventIdea = {
			id: uuid,
			title: title.toString(),
			description: details.toString(),
			icon: icon.toString(),
			likes: 0,
			location: [Number(longitude), Number(latitude)],
			townPrecomputed: town.toString(),
			date: new Date(2022, 5, 12, 14, 30, 0),
			visitorAmount: Number(visitorAmount),
			priceCents: Number(price),
			creator: userID
		};

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
