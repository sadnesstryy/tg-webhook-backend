import { FastifyInstance } from "fastify";
import { TelegramController } from "../controllers/telegram.controller";

export class TelegramRoutes {
    constructor(private readonly telegramController: TelegramController) {}

    register(app: FastifyInstance) {
        app.post("/send", this.telegramController.sendMessage.bind(this.telegramController));
        app.post("/webhook", this.telegramController.webhook.bind(this.telegramController));
        app.get("/events", this.telegramController.events.bind(this.telegramController));
    }
}