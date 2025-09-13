self.__uv$config = {
  prefix: "/up/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/u/uv.handler.js",
  client: "/u/uv.client.js",
  bundle: "/u/uv.bundle.js",
  config: "/u/uv.config.js",
  sw: "/u/uv.sw.js",
};