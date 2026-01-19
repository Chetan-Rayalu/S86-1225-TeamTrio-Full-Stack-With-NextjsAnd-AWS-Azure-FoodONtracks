import { Redis } from "ioredis";
import { logger } from "./logger";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  // Return a dummy URL for build time, will fail gracefully at runtime
  return "redis://localhost:6379";
};

let redis: Redis | null = null;

try {
  redis = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop retrying
      }
      return Math.min(times * 100, 3000); // Exponential backoff
    },
    lazyConnect: true, // Don't connect during import
  });

  redis.on("error", (error) => {
    logger.error("redis_connection_error", { error: String(error) });
  });

  redis.on("connect", () => {
    logger.info("redis_connected", {});
  });
} catch (error) {
  logger.error("redis_initialization_error", { error: String(error) });
}

export default redis!;
