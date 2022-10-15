import Hapi from "@hapi/hapi";

const plugin: Hapi.Plugin<undefined> = {
  name: "app/status",
  register: async function (server: Hapi.Server) {
    server.route({
      method: "GET",
      path: "/",
      handler: (_, h: Hapi.ResponseToolkit) => {
        return h.response({ up: true, msg: "Hello" }).code(200);
      },
    });
  },
};

export default plugin;
