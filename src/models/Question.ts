export interface Question {
    id?: string;
    content: string;
    sequence?: number;
    questions?: Question[];
    createdAt?: string;
}