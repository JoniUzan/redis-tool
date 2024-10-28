import { Router } from "express";
import { getData } from "../controllers/data-controller"; // Import your controller function

const dataRouter = Router();

// Add a route to handle GET requests at "/api/"
dataRouter.get("/", (req, res) => {
  res.send("API Root is working"); // Simple response for the root of /api
});

// Define your actual data route
dataRouter.get("/data", getData); // Assuming /api/data is your primary route

export default dataRouter;
