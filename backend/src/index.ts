import express, { Express } from "express";
import http from "http";
import dataRouter from "./routes/data-route";

const PORT = 3000;
const app: Express = express();
const server = http.createServer(app);

async function main() {
  app.use(express.json());

  app.use("/api", dataRouter); 



  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => console.error("Error starting server:", err));
