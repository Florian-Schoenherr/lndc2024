import { archivedEventIdeas, likeDictionary } from '$lib/data/data.js';
import type { EventIdea } from '$lib/types';
import { error } from '@sveltejs/kit';

function broadcastUpdate() {
	archivedEventIdeas.sort((idea1: EventIdea, idea2: EventIdea) => {
		//console.log('Sorting');

		let idea1Entry = likeDictionary[idea1.id];
		let idea2Entry = likeDictionary[idea2.id];

		//idea entry could be undefined if the idea was just set but not liked.
		let idea1Likes: number = 0;
		let idea2Likes: number = 0;

		if (idea1Entry?.amount) {
			idea1Likes = idea1Entry.amount;
		}

		if (idea2Entry?.amount) {
			idea2Likes = idea2Entry.amount;
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

	for (const connectionEntry in activeConnections) {
		const currentConnectionController = activeConnections[connectionEntry];

		const data = JSON.stringify(archivedEventIdeas);
		//console.log('SERVER: Broadcasting to:.', connectionEntry, data);
		currentConnectionController.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
	}
}

// Watch for changes in `archivedEventIdeas` (you could use a timer or similar logic for polling)
setInterval(() => {
	// You would need to replace this with real change-detection logic for archivedEventIdeas
	//console.log('SERVER: idea likes', archivedEventIdeas);
	broadcastUpdate();
	console.log('SERVER: broadcasted archived ideas.');
}, 2000); // Example interval of 5 seconds for polling

const activeConnections: { [key: string]: ReadableStreamDefaultController } = {};

export async function GET({ url }) {
	//stream lie updates;
	//see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
	//see https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultController
	return new Response(
		new ReadableStream({
			start(controller) {
				const clientID = url.searchParams.get('clientId');

				if (!clientID) {
					return error(400, 'No client id specified');
				}

				//document connection
				activeConnections[clientID] = controller;

				// Clean up when client disconnects
				/*request.signal.addEventListener('abort', () => {
					//clear active connection
					activeConnections[clientID].close();
					delete activeConnections[clientID];
					console.log(`SERVER: ${clientID} aborted connection.`);
				});*/
			},
			cancel() {
				// This is called if the reader cancels the connection e.g. reloading the page,
				// so we should stop generating strings
				const clientID = url.searchParams.get('clientId');
				if (clientID) {
					delete activeConnections[clientID];
					console.log(`SERVER: ${clientID} closed connection to archieved ideas updates.`);
				}
			}
		}),
		{
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		}
	);
}
