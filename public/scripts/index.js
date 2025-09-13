function search(url, se) {
	try {
		return new URL(url).toString();
	} catch { }
	try {
		const testUrl = new URL(`http://${url}`);
		if (testUrl.hostname.includes(".")) return testUrl.toString();
	} catch { }
	return se.replace("%s", encodeURIComponent(url));
}

async function registerSW() {
    await navigator.serviceWorker.register("/sw.js");
}

const { ScramjetController } = $scramjetLoadController();
const scramjet = new ScramjetController({
	files: {
		wasm: "/s/scramjet.wasm.wasm",
		all: "/s/scramjet.all.js",
		sync: "/s/scramjet.sync.js",
	},
});
scramjet.init();

const connection = new BareMux.BareMuxConnection("/b/worker.js");
const form = document.getElementById("kk-form");
const address = document.getElementById("kk-address");
const error = document.getElementById("kk-error");
const errorCode = document.getElementById("kk-error-code");
const defaultWispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

const getWisp = () => localStorage.getItem("wisp-url") || defaultWispUrl;
const getTransport = () => localStorage.getItem("transport") || "/e/index.mjs";
const getcore = () => localStorage.getItem("core") || "uv";

function encode(core, url) {
    if (core === "uv") return __uv$config.prefix + __uv$config.encodeUrl(url);
    if (core === "sj") return scramjet.encodeUrl(url);
}

form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    try {
        await registerSW();
    } catch (err) {
		error.textContent = "Failed to register SW";
		errorCode.textContent = err.toString();
		throw err;
    }

    const url = search(address.value, "https://duckduckgo.com/search?q=%s");

    saveToHistory(url);
    hideHistory();

    const frame = document.getElementById("kk-frame");
    frame.style.display = "block";

	if ((await connection.getTransport()) !== getTransport()) {
		await connection.setTransport(getTransport(), [{ wisp: getWisp() }]);
	}

    frame.src = encode(getcore(), url);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsOverlay.style.display === "flex") {
        settingsOverlay.style.display = "none";
    }
});
