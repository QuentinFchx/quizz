import axios from 'axios';
import { Question } from "../Question";
import { Picker } from '../Trivia';

interface OpenTriviaDbResult {
    category: string;
    type: 'multiple';
    difficulty: 'easy';
    question: string;
    correct_answer: string;
    incorrect_answers: string [];
}

export class OpenTriviaDBPicker implements Picker {
    private client = axios.create({
        baseURL: 'https://opentdb.com'
    });
    private token: string;

    constructor() {
        this.getToken();
    }

    get ready() {
        return !!this.token;
    }

    async pickQuestion() {
        const res = await this.client.get<{results: OpenTriviaDbResult[]}>(`api.php?amount=1&token=${this.token}`);
        const entry = res.data.results[0];
        return new Question(entry.question, entry.correct_answer);
    }

    private async getToken() {
        const res = await this.client.get<{token: string}>('api_token.php?command=request');
        this.token = res.data.token;
    }
}
