import axios from 'axios';
import * as he from 'he';
import { Question } from '../Question';
import { Picker } from '../Trivia';

interface OpenTriviaDbResult {
    category: string;
    type: 'multiple';
    difficulty: 'easy';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export class OpenTriviaDBPicker implements Picker {
    private client = axios.create({
        baseURL: 'https://opentdb.com',
    });
    private token: string;

    constructor() {
        this.getToken();
    }

    get ready() {
        return !!this.token;
    }

    async pickQuestion() {
        const res = await this.client.get<{ results: OpenTriviaDbResult[] }>(`api.php?amount=1&type=multiple&token=${this.token}`);
        const entry = res.data.results[0];
        const sanitizedQuestion = he.decode(entry.question);
        const question = `[${entry.category} - ${entry.difficulty}] ${sanitizedQuestion}`;
        const sanitizedAnswer = he.decode(entry.correct_answer);
        return new Question(question, sanitizedAnswer, [...entry.incorrect_answers], false);
    }

    private async getToken() {
        const res = await this.client.get<{ token: string }>('api_token.php?command=request');
        this.token = res.data.token;
    }
}
