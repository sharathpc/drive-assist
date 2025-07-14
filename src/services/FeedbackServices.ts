import { Chat } from "@/models";
import axiosInstance from "@/lib/axios";


const getFeedbackChatsService = (): Promise<Chat[]> => {
    return axiosInstance.get(`/api/feedback`)
        .then(response => response.data);
}

const getFeedbackChatService = (chatId: string): Promise<Chat> => {
    return axiosInstance.get(`/api/feedback/${chatId}`)
        .then(response => response.data);
}

export {
    getFeedbackChatsService,
    getFeedbackChatService,
}