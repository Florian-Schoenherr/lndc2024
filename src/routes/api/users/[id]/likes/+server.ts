import { likeDictionary } from '$lib/data/data';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const clientID = params.id;

	//// Caclulate a list of eventIdeas the user with clienID liked
	let currentUsersLikedIdeaIds = [];

	for (const eventIdeaId in likeDictionary) {
		if (likeDictionary[eventIdeaId].list.includes(clientID)) {
			currentUsersLikedIdeaIds.push(eventIdeaId);
		}
	}
	return json(currentUsersLikedIdeaIds, { status: 201 });
}
