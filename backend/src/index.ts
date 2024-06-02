import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import { routes } from "./routes";

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));
app.use(bodyParser.text({ limit: "200mb" }));

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
