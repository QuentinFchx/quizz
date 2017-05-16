import * as fs from 'fs';
import * as path from 'path';
import { Question } from './Question';

const MAX_UNANSWERED_QUESTIONS = 3;
const QUESTION_DELAY = 30000;
const HINT1_DELAY = 10000;
const HINT2_DELAY = 20000;
const PAUSE_DELAY = 5000;

const ROOT_DIR = path.resolve(__dirname, '../');

export class Quizz {
    questions: any[];
    private unansweredQuestionsCount = 0;
    private currentQuestion: Question;
    private qto: NodeJS.Timer;
    private h1to: NodeJS.Timer;
    private h2to: NodeJS.Timer;

    constructor(questionsFile = './questions/fr/database.txt',
        private scores: { [key: string]: number } = {},
        private print: (text: string) => void = (text: string) => { console.log(text); }) {
        this.questions = Quizz.loadQuestions(questionsFile);
    }

    start() {
        this.print('Starting Quizz...');
        this.nextQuestion();
    }

    private pickQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        const question = this.questions[randomIndex];
        return new Question(question);
    }

    private ask() {
        this.currentQuestion = this.pickQuestion();
        this.print(this.currentQuestion.question);
        this.qto = setTimeout(() => this.timeout(), QUESTION_DELAY);
        this.h1to = setTimeout(() => this.giveHint(1), HINT1_DELAY);
        this.h2to = setTimeout(() => this.giveHint(2), HINT2_DELAY);
        this.unansweredQuestionsCount += 1;
    }

    private giveHint(level = 1) {
        this.print(this.currentQuestion.hint(level));
    }

    check(answer: string, user: any) {
        this.unansweredQuestionsCount = 0;
        if (this.currentQuestion && this.currentQuestion.check(answer)) {
            this.print(`${user} found the answer:   ${this.currentQuestion.answer}`);
            this.reward(user, 10);
            this.clearTimers();
            this.nextQuestion();
        }
    }

    private timeout() {
        this.print(`The answer was: ${this.currentQuestion.answer}`);
        if (this.unansweredQuestionsCount > MAX_UNANSWERED_QUESTIONS) this.stop();
        else this.nextQuestion();
    }

    private reward(user: any, points: number) {
        if (!this.scores[user]) this.scores[user] = 0;
        this.scores[user] += points;
    }

    private nextQuestion() {
        this.currentQuestion = null;
        this.qto = setTimeout(() => this.ask(), PAUSE_DELAY);
    }

    private getTop(n: number) {
        return Object.keys(this.scores)
            .map(key => {
                return {
                    user: key,
                    score: this.scores[key]
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, n);
    }

    displayTop(n: number = 3) {
        const top = this.getTop(n);
        let res = `TOP ${n}`;
        top.forEach((entry, index) => {
            res += `\n${index + 1}. ${entry.user}:  ${entry.score}`;
        });
        this.print(res);
    }

    private clearTimers() {
        clearTimeout(this.qto);
        delete this.qto;
        clearTimeout(this.h1to);
        delete this.h1to;
        clearTimeout(this.h2to);
        delete this.h2to;
    }

    stop() {
        this.print('Stopping Quizz...');
        this.clearTimers();
    }

    static loadQuestions(filePath: string) {
        const _filePath = path.resolve(ROOT_DIR, filePath);
        const file = fs.readFileSync(_filePath);
        return file.toString().split('\n');
    }
}
