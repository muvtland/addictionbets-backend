import { createClient } from "redis";
const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
// export const client = await createClient()
//     .on('error', err => console.log('Redis Client Error', err))
//     .connect();
// import { createClient } from 'redis';

export const client = await createClient({
    password: redisPassword,
    socket: {
        host: redisHost,
        port: 10806
    }
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
