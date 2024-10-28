import { Request, Response } from "express";
import { connectToRedis } from "../config/db";

// Function to fetch data with optional search and pagination
export async function getData(req: Request, res: Response) {
  try {
    const client = await connectToRedis();

    // Get query parameters for search and pagination
    const searchQuery = req.query.search as string || ""; // Search by part of the key or value
    const limit = parseInt(req.query.limit as string, 10) || 20; // Default limit is 20
    const page = parseInt(req.query.page as string, 10) || 1; // Default page is 1

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    let keys;

    // If a search query is provided, use it to match keys or fetch everything if no search is provided
    if (searchQuery) {
      keys = await client.scan(0, { MATCH: `*${searchQuery}*`, COUNT: 1000 });
    } else {
      keys = await client.scan(0, { COUNT: 1000 }); // Fetch first 1000 keys
    }

    // Fetch data records from Redis
    const dataRecords = [];
    for (const key of keys.keys) {
      const dataValue = await client.get(key);
      if (dataValue) {
        const dataObject = JSON.parse(dataValue);
        dataRecords.push({ key, data: dataObject });
      }
    }

    // Pagination: Return the requested page
    const paginatedData = dataRecords.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: paginatedData,
      total: dataRecords.length, // Total number of records matching the search
      page,
      totalPages: Math.ceil(dataRecords.length / limit),
    });

    // Close the Redis connection
    await client.quit();
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
