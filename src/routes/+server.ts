import { db } from '$lib/server/db';
import { eventidea, type EventIdeaTableEntry } from '$lib/server/db/schema';
import type { EventIdea } from '$lib/types';
import { json } from '@sveltejs/kit';

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
