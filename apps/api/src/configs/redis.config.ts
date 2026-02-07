import Redis from "ioredis";
import { env } from "../configs/env";

const redis = new Redis(env.REDIS_URL || "redis://localhost:6379", {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 100, 2000)
    },
});

redis.on("connect", () => {
    console.log("REDIS : client connecting");
});

redis.on("ready", () => {
    console.log("REDIS : client ready");
})

redis.on("error", (err) => {
    console.log("REDIS : client error",err );
});



export default redis;