import { AbstractGame } from '../AbstractGame';
import { Question } from './Question';

const QUESTION_DELAY = 30000;
const HINT1_DELAY = 10000;
const HINT2_DELAY = 20000;

export interface Picker {
    ready: boolean;
    pickQuestion(): Promise<Question>;
}

export class Trivia extends AbstractGame {
    static title = 'Trivia';
    static rules = 'Answer the questions';

    private currentQuestion: Question | null;
    private qto: NodeJS.Timer | null;
    private h1to: NodeJS.Timer | null;
    private h2to: NodeJS.Timer | null;

    constructor(private picker: Picker) {
        super();
    }

    get ready() {
        return this.picker.ready;
    }

    start(output: (text: string) => void, over: (user: any) => void) {
        this.output = output;
        this.over = over;

        this.ask();
    }

    handleMessage(answer: string, user: any) {
        if (this.currentQuestion && this.currentQuestion.check(answer)) {
            this.output(`${user} found the answer:   ${this.currentQuestion.answer}`);
            delete this.currentQuestion;
            this.over(user);
        }
    }

    stop() {
        this.clearTimers();
        if (this.currentQuestion) {
            this.output(`The answer was:   ${this.currentQuestion.answer}`);
            delete this.currentQuestion;
        }
    }

    private async ask() {
        try {
            this.currentQuestion = await this.picker.pickQuestion();
            this.output(this.currentQuestion.question);
            this.qto = setTimeout(() => this.timeout(), QUESTION_DELAY);
            this.h1to = setTimeout(() => this.giveHint(1), HINT1_DELAY);
            this.h2to = setTimeout(() => this.giveHint(2), HINT2_DELAY);
        } catch {
            this.over(null);
        }
    }

    private giveHint(level = 1) {
        this.output(this.currentQuestion.hint(level));
    }

    private timeout() {
        this.output(`Timeout! The answer was:   ${this.currentQuestion.answer}`);
        delete this.currentQuestion;
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
}
