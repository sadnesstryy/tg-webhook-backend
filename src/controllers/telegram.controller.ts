import { FastifyRequest, FastifyReply } from "fastify";
import type { SendMessageBody } from "../types/telegram";
import { TelegramService } from "../services/telegram.service";
import { TelegramEventsService } from "../services/telegram-events.service";

export class TelegramController {
    constructor(private readonly telegramService: TelegramService,
        private readonly telegramEventsService: TelegramEventsService
    ) {}

    async sendMessage(request: FastifyRequest<{ Body: SendMessageBody }>, reply: FastifyReply) {
        try {
            const { chatId, text } = request.body;

            if (!chatId || !text) {
                return reply.status(400).send({
                    success: false,
                    message: "Both fields are required (chatId, text)"
                });
            }

            const result =
                await this.telegramService.sendTelegramMessage(
                    chatId,
                    text
                );

            this.telegramEventsService.sendMessage({
                chatId,
                text,
                sender: "bot"
            });

            return reply.send({
                success: true,
                result
            });

        } catch (err) {
            return reply.status(400).send({
                success: false,
                message: "Failed to send telegram message"
            });
        }
    }

    async webhook(request: FastifyRequest, reply: FastifyReply) {
        const update = request.body as any;

        request.log.info({ update });

        const message = update?.message;

        if (!message?.text) return reply.send({ success: true });

        const chatId = String(message.chat.id);
        const text = message.text;

        this.telegramEventsService.sendMessage({ chatId, text, sender: "user" });

        return reply.send({ success: true });
    }

    async events(request: FastifyRequest, reply: FastifyReply) {
        reply.hijack();

        reply.raw.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin":
                process.env.CLIENT_URL || "*",
        });

        reply.raw.write(": connected\n\n");

        this.telegramEventsService.addClient(reply.raw);
    }
}