importScripts('/s/scramjet.all.js');
importScripts("/u/uv.bundle.js");
importScripts("/u/uv.config.js");
importScripts("/u/uv.sw.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

const uv = new UVServiceWorker();

async function handleRequest(event) {
    await scramjet.loadConfig();

    if (scramjet.route(event)) {
        return scramjet.fetch(event);
    }

    if (uv.route(event)) {
		return await uv.fetch(event);
	}

    return fetch(event.request);
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});
