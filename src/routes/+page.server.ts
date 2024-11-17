import { type EventIdea } from '$lib/types';
import type { PageServerLoad } from './$types';
import { v6 as uuidv6 } from 'uuid';

export const load: PageServerLoad = async ({
	cookies,
	fetch
}): Promise<{
	userId: string;
	eventIdeas: EventIdea[];
	archivedEventIdeas: EventIdea[];
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

	////Fetch eventIdea data
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

	////Fetch archived eventIdea data
	const eventIdeaArchivedResponse = await fetch('/api/ideas/archived');
	let archivedEventIdeas: EventIdea[] = await eventIdeaArchivedResponse.json();

	//adapt the properties to the correct data type
	//...idea does a shallow copy of each single idea object -> it add all properties. Some of them get adapted here.
	archivedEventIdeas = archivedEventIdeas.map((idea) => ({
		...idea,
		dateRange: {
			minDate: new Date(idea.dateRange.minDate),
			maxDate: new Date(idea.dateRange.maxDate)
		}
	}));

	console.log('Fetched the following archived eventIdeas: ', archivedEventIdeas);

	//// Get the like amount of each event
	const eventIdeaLikesResponse = await fetch('/api/ideas/likes');
	const eventIdeaLikes: { [key: string]: number } = await eventIdeaLikesResponse.json();

	//// Get the list of eventIdeas the current user likes
	const currentUsersLikedIdeaIdsResponse = await fetch(`/api/users/${userCookieId}/likes`);
	const currentUsersLikedIdeaIds: string[] = await currentUsersLikedIdeaIdsResponse.json();
	//console.log(currentUsersLikedIdeaIds);

	return {
		userId: userCookieId,
		eventIdeas: eventIdeas,
		archivedEventIdeas: archivedEventIdeas,
		eventIdeasLikeAmount: eventIdeaLikes,
		eventIdeasUserLiked: currentUsersLikedIdeaIds
	};
};
