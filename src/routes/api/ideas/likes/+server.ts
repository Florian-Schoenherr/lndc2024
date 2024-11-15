import { likeDictionary } from '$lib/data/data';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	//// Caclulate the like amount of each event
	const eventIdeaLikes = {};
	for (const eventIdeaId in likeDictionary) {
		eventIdeaLikes[eventIdeaId] = likeDictionary[eventIdeaId].amount;
	}

	return json(eventIdeaLikes, { status: 201 });
}

export async function POST({ cookies, request }) {
	let userID = cookies.get('clientID');

	if (!userID) {
		console.log(`userID ${userID} was not set..,`);
		return error(400, { userID, missing: true });
	}
	console.log(`Submitting like action with userID ${userID}`);

	const formData = await request.formData();
	console.log(formData);

	const ideaID = formData.get('ideaID');
	if (!ideaID) {
		return error(400, 'ideaId was missing at form data');
	}

	const likedState = formData.get('likedState');
	if (!likedState) {
		return error(400, 'likedState was missing at form Data');
	}

	const isLiked: string = likedState.toString();
	const validValues = ['true', 'false'];

	if (!validValues.includes(isLiked)) {
		return error(400, 'likeState can be rather true or false !');
	}

	//Initialize likelist for ID idea if its not present in the Dictionary.
	if (!likeDictionary[ideaID]) {
		likeDictionary[ideaID] = { list: [], amount: 0 };
	}

	const ideaLikes = likeDictionary[ideaID].list;

	// Read form formData
	if (isLiked === 'true') {
		//Add Likes
		console.log('Called add Like');
		console.log(likeDictionary);
		console.log(ideaLikes);

		if (likeDictionary[ideaID].list.includes(userID.toString())) {
			return error(400, 'User liked this Idea already !');
		}

		ideaLikes.push(userID.toString());
		likeDictionary[ideaID].list = ideaLikes;
		likeDictionary[ideaID].amount = ideaLikes.length;

		console.log('Result add Like');
		console.log(likeDictionary);
		console.log(ideaLikes);

		return new Response(
			JSON.stringify({
				message: 'Like status updated successfully'
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	}

	if (isLiked === 'false') {
		//Remove Likes
		console.log('Called remove Like');
		console.log(likeDictionary);
		console.log(ideaLikes);

		if (!likeDictionary[ideaID].list.includes(userID.toString())) {
			return error(400, 'Users like couldn`t be found !');
		}

		const index = ideaLikes.indexOf(userID.toString(), 0);
		if (index > -1) {
			ideaLikes.splice(index, 1);
			likeDictionary[ideaID].list = ideaLikes;
			likeDictionary[ideaID].amount = ideaLikes.length;
		}

		console.log('Result remove Like');
		console.log(likeDictionary);
		console.log(ideaLikes);

		return new Response(
			JSON.stringify({
				message: 'Like status updated successfully'
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
