import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

import { TelegramService } from "./services/telegram.service";
import { TelegramController } from "./controllers/telegram.controller";
import { TelegramRoutes } from "./routes/telegram.routes";
import { TelegramEventsService } from "./services/telegram-events.service";

async function main() {
    const app = Fastify({
        logger: true,
    });

    await app.register(cors, {
        origin: process.env.CLIENT_URL,
    });

    const telegramService = new TelegramService();
    const telegramEventsService = new TelegramEventsService();

    const telegramController = new TelegramController(
        telegramService,
        telegramEventsService
    );

    const telegramRoutes = new TelegramRoutes(
        telegramController
    );

    telegramRoutes.register(app);
    
    await telegramService.setWebhook();

    try {
        await app.listen({
            port: Number(process.env.API_PORT) || 8080,
            host: "0.0.0.0",
        });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

main();