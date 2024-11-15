import { likeDictionary } from '$lib/data/data.js';
import { error } from '@sveltejs/kit';

function broadcastUpdate() {
	for (const connectionEntry in activeConnections) {
		const currentConnectionController = activeConnections[connectionEntry];

		//// Caclulate the like amount of each event
		const eventIdeaLikes = {};
		for (const eventIdeaId in likeDictionary) {
			eventIdeaLikes[eventIdeaId] = likeDictionary[eventIdeaId].amount;
		}

		const data = JSON.stringify(eventIdeaLikes);
		//console.log('SERVER: Broadcasting to:.', connectionEntry, data);
		currentConnectionController.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
	}
}

// Watch for changes in `likeDictionary` (you could use a timer or similar logic for polling)
setInterval(() => {
	// You would need to replace this with real change-detection logic for likeDictionary
	//console.log('SERVER: idea likes', likeDictionary);
	broadcastUpdate();
	//console.log('SERVER: broadcasted idea likes.');
}, 1000); // Example interval of 5 seconds for polling

const activeConnections: { [key: string]: ReadableStreamDefaultController } = {};

export async function GET({ params, url }) {
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

				// Send first message on conneciton build up
				const firstMessage = JSON.stringify(likeDictionary);
				controller.enqueue(new TextEncoder().encode(`data: ${firstMessage}\n\n`));

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
					console.log(`SERVER: ${clientID} closed connection.`);
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
