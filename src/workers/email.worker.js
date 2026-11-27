import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { sendConfirmationEmail } from "../services/mail.service.js";
import { db } from "../prisma/db.js";

export const emailWorker = new Worker(
    "email-queue", 
    async(job) => {
        console.log(`[Worker] Started processing job ${job.id} of type: ${job.name}`);

        if(job.name === "sendConfirmation") {
            const { to, name, title, scheduledAt, userId, appointmentId } = job.data;

            await sendConfirmationEmail({ to, name, title, scheduledAt });

            await db.notificationLog.create({
                data: {
                    type: "CONFIRMATION",
                    channel: "EMAIL",
                    recipient: to,
                    status: "SENT", 
                    sentAt: new Date(),
                    userId,
                    appointmentId,
                }
            });

            console.log(`[Worker] Successfully finished job ${job.id} or ${to}`);
        }
    },
    {
        connection: redisConnection,
        concurrency: 5,
    }
);

emailWorker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} has COMPLETED`);
});

emailWorker.on("failed", (job, err) => {
    console.err(`[Worker] Job ${job?.id} has FAILED with error: ${err.message}`);
});

// import { redisConnection } from "../config/redis";

// const worker = new Worker("email-queue", async (job) => {
//     console.log(`Processing job: ${job.name} with data:`, job.data);
// }, { connection: redisConnection });