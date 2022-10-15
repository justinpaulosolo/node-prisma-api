import Hapi from "@hapi/hapi";
import prisma from "../plugins/prisma";
import status from "../plugins/status";
import users from "../plugins/users";

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
});

export async function createServer(): Promise<Hapi.Server> {
  await server.register([status, prisma, users]);
  await server.initialize();

  return server;
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
