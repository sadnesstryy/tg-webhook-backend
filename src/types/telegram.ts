export interface SendMessageBody {
    chatId: string;
    text: string;
}

export interface ITelegramIncomingMessage {
    chatId: string;
    text: string;
    sender: "user" | "bot"
}