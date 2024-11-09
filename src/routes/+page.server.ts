import { type EventIdea, type LikeDictionary } from '$lib/types';
import type { PageServerLoad } from './$types';
import { v6 as uuidv6 } from 'uuid';

export const load: PageServerLoad = async ({
	url,
	params,
	cookies,
	fetch
}): Promise<{
	userId: string;
	eventIdeas: EventIdea[];
	eventIdeasUserLiked: string[];
	eventIdeasLikeAmount: { [key: string]: number };
}> => {
	// const eventIdeas = await db.query.eventIdea.findMany();

	let expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 1000);

	let userCookieId = cookies.get('clientID');

	if (userCookieId) {
		console.log(`Loaded clientID ${userCookieId} from cookie...`);
		cookies.set('clientID', userCookieId.toString(), {
			path: '/',
			expires: expirationDate,
			secure: false
		});
		console.log(`Renewed expiration Date of Cookie "clientID":${userCookieId}.`);
	} else {
		userCookieId = uuidv6();
		console.log(`No client cookie with id found. Generated clientID ${userCookieId} for client.`);

		cookies.set('clientID', userCookieId, {
			path: '/',
			expires: expirationDate,
			secure: false
		});
		console.log(`Set Cookie "clientID":${userCookieId}.`);
	}

	////Fetch eventIdea date
	const eventIdeaResponse = await fetch('/api/ideas');
	let eventIdeas: EventIdea[] = await eventIdeaResponse.json();

	//adapt the properties to the correct data type
	//...idea does a shallow copy of each single idea object -> it add all properties. Some of them get adapted here.
	eventIdeas = eventIdeas.map((idea) => ({
		...idea,
		dateRange: {
			minDate: new Date(idea.dateRange.minDate),
			maxDate: new Date(idea.dateRange.maxDate)
		}
	}));

	console.log('Fetched the following eventIdeas: ', eventIdeas);

	//// Get the like data for each event

	const likeDataResponse = await fetch('/api/ideas/likes');
	let likeDictionary: LikeDictionary = await likeDataResponse.json();

	//// Caclulate the like amount of each event
	let eventIdeaLikes = {};
	for (const eventIdeaId in likeDictionary) {
		eventIdeaLikes[eventIdeaId] = likeDictionary[eventIdeaId].length;
	}

	//// Caclulate a list of eventIdeas the current user likes
	let currentUsersLikedIdeaIds = [];

	for (const eventIdeaId in likeDictionary) {
		if (likeDictionary[eventIdeaId].includes(userCookieId.toString())) {
			currentUsersLikedIdeaIds.push(eventIdeaId);
		}
	}

	//console.log('Reloading page.');
	//console.log('Event ideas: ');
	//console.log(eventIdeas);

	//Sort entries by likes
	eventIdeas.sort((idea1: EventIdea, idea2: EventIdea) => {
		console.log('Sorting');

		let idea1Likes: number = eventIdeaLikes[idea1.id];
		let idea2Likes: number = eventIdeaLikes[idea2.id];

		if (!idea1Likes) {
			idea1Likes = 0;
		}

		if (!idea2Likes) {
			idea2Likes = 0;
		}

		//console.log(`idea1Likes: ${idea1Likes} idea2Likes: ${idea2Likes}`);

		if (idea1Likes === idea2Likes) {
			//console.log('sorted equals');
			return 0;
		}
		if (idea1Likes < idea2Likes) {
			//console.log('sorted less');
			return 1;
		}
		//console.log('sorted more');
		return -1;
	});

	return {
		userId: userCookieId,
		eventIdeas: eventIdeas,
		eventIdeasLikeAmount: eventIdeaLikes,
		eventIdeasUserLiked: currentUsersLikedIdeaIds
	};
};
