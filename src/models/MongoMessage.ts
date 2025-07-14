import { Message } from "ai";

export interface MongoMessage extends Message {
    data?: {
        id?: string;
        feedback: boolean | null;
    }
}