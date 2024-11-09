import { likeDictionary } from '$lib/data/data';
import { error, json, redirect } from '@sveltejs/kit';

export async function GET() {
	return json(likeDictionary, { status: 201 });
}

export async function POST({ cookies, request }) {
	const data = await request.formData();
	console.log(data);

	//const userID = data.get('userID');
	//if (!userID) {
	//	return fail(400, { userID, missing: true });
	//}
	const ideaID = data.get('ideaID');
	if (!ideaID) {
		return error(400, 'ideaId was missing at form data');
	}
	const likedState = data.get('likedState');
	if (!likedState) {
		return error(400, 'likedState was missing at form Data');
	}

	let userID = cookies.get('clientID');

	if (!userID) {
		console.log(`userID ${userID} was not set..,`);
		return error(400, { userID, missing: true });
	}

	console.log(`Submitting like action with userID ${userID}`);

	if (!likeDictionary[ideaID]) {
		likeDictionary[ideaID] = [];
	}

	let ideaLikes = likeDictionary[ideaID];

	// Read form data
	if (likedState.toString() === 'true') {
		//Add Likes
		//console.log('Called add Like');
		ideaLikes.push(userID.toString());
		likeDictionary[ideaID] = ideaLikes;
		//console.log(likeDictionary);
		return redirect(303, '/');
	}

	if (likedState.toString() === 'false') {
		//Remove Likes
		//console.log('Called remove Like');
		//console.log(likeDictionary);
		//console.log(ideaLikes);
		const index = ideaLikes.indexOf(userID.toString(), 0);
		if (index > -1) {
			ideaLikes.splice(index, 1);
			likeDictionary[ideaID] = ideaLikes;
		}
		return redirect(303, '/');
	}
	return error(400, 'An error occured processing the form data for a like.');
}
