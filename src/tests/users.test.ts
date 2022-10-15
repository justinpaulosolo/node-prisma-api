import { createServer } from "../utils/server";
import Hapi from "@hapi/hapi";

describe("POST /users - create user", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  let userId;

  test("create user", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        firstName: "test-first-name",
        lastName: "test-last-name",
        email: "test-email",
        social: {
          facebook: "test-facebook",
          twitter: "test-twitter",
          github: "test-github",
          website: "test-website",
        },
      },
    });

    expect(res.statusCode).toEqual(201);
    userId = JSON.parse(res.payload).id;
    expect(typeof userId === "number").toBeTruthy();
  });
});
