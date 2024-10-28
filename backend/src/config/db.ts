import redis from "redis";

export async function connectToRedis() {
  // Create a Redis client
  const client = redis.createClient({
    url: "redis://localhost:6379", // Default Redis connection (localhost)
  });

  // Handle connection events
  client.on("connect", () => {
    console.log("Connected to Redis server");
  });

  client.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  // Connect to the Redis server
  await client.connect();

  return client; // Return the connected client
}
