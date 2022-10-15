import express from "express";
import cors from "cors";
import prisma from "./utils/db/prisma";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const data = {
    code: 200,
    message: "Hello World",
  };
  res.json(data);
});

app.listen(3002, () =>
  console.log("Server running on port at: http://localhost:3002")
);
