import { archivedEventIdeas } from '$lib/data/data';
import { json } from '@sveltejs/kit';

export async function GET() {
	return json(archivedEventIdeas, { status: 201 });
}
