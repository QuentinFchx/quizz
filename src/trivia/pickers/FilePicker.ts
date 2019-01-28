import * as fs from 'fs';
import * as path from 'path';
import { Question } from "../Question";
import { Picker } from '../Trivia';

const ROOT_DIR = path.resolve(__dirname, '../../');

export class FilePicker implements Picker {
    ready = true;
    private questions: any[];

    constructor(questionsFile: string) {
        this.questions = this.loadQuestions(questionsFile);
    }

    pickQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        const _question = this.questions[randomIndex];
        const [question, answer] = _question.split(' \\ ');
        return Promise.resolve(new Question(question, answer));
    }

    private loadQuestions(filePath: string) {
        const _filePath = path.resolve(ROOT_DIR, filePath);
        const file = fs.readFileSync(_filePath);
        return file.toString().split('\n');
    }
}
