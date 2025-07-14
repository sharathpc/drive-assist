export interface FeedbackMessage {
    id: string;
    feedback: boolean;
    createdAt: string;
    message: {
        id: string;
        createdAt?: Date;
        content: string;
        chatId: string;
    };
}