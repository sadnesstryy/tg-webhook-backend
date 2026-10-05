import { ServerResponse } from "node:http";
import { ITelegramIncomingMessage } from "../types/telegram";

export class TelegramEventsService {
    private readonly clients = new Set<ServerResponse>();

    addClient(response: ServerResponse) {
        this.clients.add(response);

        response.on("close", () => {
            this.clients.delete(response);
        });
    }

    sendMessage(message: ITelegramIncomingMessage) {
        const data = `data: ${JSON.stringify(message)}\n\n`;

        for(const client of this.clients) {
            client.write(data);
        }
    }
}