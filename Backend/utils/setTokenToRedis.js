import { redis } from "../db/redis.js";


export const setTokenToRedis = async (userId, refreshToken ) => {
  try {
    await redis.set(
      `refresh-token:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.log("Error in redis", error.message);
  }
};
