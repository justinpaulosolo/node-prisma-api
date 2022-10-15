import Hapi from "@hapi/hapi";
const usersPlugin: Hapi.Plugin<undefined> = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "POST",
        path: "/users",
        handler: createUserHandler,
      },
    ]);
  },
};

interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  social: {
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

async function createUserHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const { prisma } = request.server.app;
  const payload = request.payload as UserInput;

  try {
    const user = await prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        social: JSON.stringify(payload.social),
      },
      select: {
        id: true,
      },
    });
    console.log(user);
    return h.response(user).code(201);
  } catch (error) {
    console.log(error);
  }
}

export default usersPlugin;
