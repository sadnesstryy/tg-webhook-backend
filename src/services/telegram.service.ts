import axios from "axios";

export class TelegramService {
    private readonly baseUrl: string;
    
    constructor() {
        const botToken = process.env.TELEGRAM_BOT_TOKEN

        if(!botToken) {
            throw new Error("PRIVATE_TELEGRAM_BOT_TOKEN is required");
        }

        this.baseUrl = `https://api.telegram.org/bot${botToken}`;
    }

    async sendTelegramMessage(chatId: string, text: string) {
        const resp = await axios.post(`${this.baseUrl}/sendMessage`, {
            chat_id: chatId,
            text
        });

        return resp.data;
    }

    async setWebhook() {
        const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

        if(!webhookUrl) throw new Error("Telegram webhook url is required");
        
        const resp = await axios.post(`${this.baseUrl}/setWebhook`, {
            url: webhookUrl
        });

        return resp.data;
    }
}