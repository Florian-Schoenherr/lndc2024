import { eventIdeas } from '$lib/data';
import { db } from '$lib/server/db';
import type { EventIdeaTableEntry } from '$lib/server/db/schema';
import type { EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

let nextClientCookieId: number = 1;
let persistedLikesPerUser = { 0: [] }; //{userID: ["ideaID1","ideaId2"]} // 2: ["1"]}

export const load: PageServerLoad = async ({
	url,
	params,
	cookies
}): Promise<{ clientId: number; eventIdeas: EventIdea[]; likedEventIds: any }> => {
	// const eventIdeas = await db.query.eventIdea.findMany();
	let clientCookieId: number = cookies.get('clientID');
	if (!persistedLikesPerUser[clientCookieId]) {
		persistedLikesPerUser[clientCookieId] = [];
	}

	if (!clientCookieId) {
		clientCookieId = nextClientCookieId;
		cookies.set('clientID', nextClientCookieId.toString(), { path: '/' });

		nextClientCookieId++;
	}

	///// Load persisted data for user //////////////
	//transmit to the page which events the user had already liked.
	let likeEntries = Object.values(persistedLikesPerUser); //get only the entries without userIDs e.g. [["1","2"],["1"]]
	if (!likeEntries) {
		likeEntries = [];
	}

	let combinedLikeEntries = likeEntries.flat();
	console.log(`All persisted Like Entries: ${combinedLikeEntries}.`);

	eventIdeas.forEach((idea) => {
		let allEntriesForIdeaID = combinedLikeEntries.find((entry) => entry === idea.id);
		if (allEntriesForIdeaID) {
			idea.likes = allEntriesForIdeaID.length;
			console.log(`For Idea with ID ${idea.id} we restored ${allEntriesForIdeaID.length} likes.`);
		} else {
			idea.likes = 0;
		}
	});

	let likedEventIds = persistedLikesPerUser[clientCookieId];

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
		likedEventIds: likedEventIds
	};
};

export const actions = {
	submitIdea: async ({ cookies, request }) => {
		const data = await request.formData();

		console.log(data);

		const icon = data.get('icon');
		if (!icon) {
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

		let newEventIdea: EventIdea = {
			id: '3',
			title: title.toString(),
			description: details.toString(),
			icon: icon.toString(),
			likes: 0,
			location: [Number(longitude), Number(latitude)],
			townPrecomputed: town.toString(),
			date: new Date(2022, 5, 12, 14, 30, 0),
			visitorAmount: Number(visitorAmount),
			priceCents: Number(price),
			creator: 'user'
		};

		eventIdeas.push(newEventIdea);
		return { success: true };
	},
	changeLikeState: async ({ cookies, request }) => {
		console.log('AddLike');

		const data = await request.formData();
		console.log(data);

		const userID = data.get('userID');
		if (!userID) {
			return fail(400, { userID, missing: true });
		}
		const ideaID = data.get('ideaID');
		if (!ideaID) {
			return fail(400, { ideaID, missing: true });
		}
		const likedState = data.get('likedState');
		if (!likedState) {
			return fail(400, { likedState, missing: true });
		}

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
