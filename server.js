import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weather.js";
import morgan from "morgan";
import path from 'path'

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use("/v1", weatherRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")),
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.listen(3000, () => {
  console.log("server running: 3000", 3000);
});
