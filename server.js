import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import express from "express";

const app = express();
const port = 3000;

logging.set_level(logging.DEBUG);

Object.assign(wisp.options, {
    allow_udp_streams: false,
});

app.use(express.static("public"));

app.use("/u/", express.static(uvPath));
app.use("/s/", express.static(scramjetPath));
app.use("/e/", express.static(epoxyPath));
app.use("/l/", express.static(libcurlPath));
app.use("/b/", express.static(baremuxPath));

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wisp.routeRequest(request, socket, head);
});
