import * as fs from 'fs';
import * as path from 'path';

import { AbstractGame } from '../AbstractGame';
import { Question } from './Question';

const QUESTION_DELAY = 30000;
const HINT1_DELAY = 10000;
const HINT2_DELAY = 20000;

const ROOT_DIR = path.resolve(__dirname, '../');

interface QuizzParams {
    questionsFile: string;
}

export class Quizz extends AbstractGame {
    static title = 'Trivia';
    static rules = 'Answer the questions';

    private questions: any[];
    private currentQuestion: Question;
    private qto: NodeJS.Timer;
    private h1to: NodeJS.Timer;
    private h2to: NodeJS.Timer;

    constructor(options: QuizzParams) {
        super();
        this.questions = Quizz.loadQuestions(options.questionsFile);
        this.ready = true;
    }

    start(output: (text: string) => void, over: (user: any) => void) {
        this.output = output;
        this.over = over;

        this.ask();
    }

    handleMessage(answer: string, user: any) {
        if (this.currentQuestion && this.currentQuestion.check(answer)) {
            this.output(`${user} found the answer:   ${this.currentQuestion.answer}`);
            this.over(user);
        }
    }

    stop() {
        this.clearTimers();
        delete this.currentQuestion;
    }

    private pickQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        const question = this.questions[randomIndex];
        return new Question(question);
    }

    private ask() {
        this.currentQuestion = this.pickQuestion();
        this.output(this.currentQuestion.question);
        this.qto = setTimeout(() => this.timeout(), QUESTION_DELAY);
        this.h1to = setTimeout(() => this.giveHint(1), HINT1_DELAY);
        this.h2to = setTimeout(() => this.giveHint(2), HINT2_DELAY);
    }

    private giveHint(level = 1) {
        this.output(this.currentQuestion.hint(level));
    }

    private timeout() {
        this.output(`Timeout! The answer was:  ${this.currentQuestion.answer}`);
        this.over(null);
    }

    private clearTimers() {
        clearTimeout(this.qto);
        delete this.qto;
        clearTimeout(this.h1to);
        delete this.h1to;
        clearTimeout(this.h2to);
        delete this.h2to;
    }

    static loadQuestions(filePath: string) {
        const _filePath = path.resolve(ROOT_DIR, filePath);
        const file = fs.readFileSync(_filePath);
        return file.toString().split('\n');
    }
}
