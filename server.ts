import express, { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { readdirSync } from "fs";

const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

readdirSync("./routes").map((files) =>
  app.use("/api/v1", require(`./routes/${files}`).default)
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
