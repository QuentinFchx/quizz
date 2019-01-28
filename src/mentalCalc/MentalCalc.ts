import { random } from 'lodash';

import { AbstractGame } from '../AbstractGame';

const DURATION = 20 * 1000;

export class MentalCalc extends AbstractGame {
    static title = 'MentalCalc';
    static rules = 'Be the first to find the solution!';

    ready = true;

    private currentDraw: {
        numbers: number[]
        result: number;
    };
    private to: NodeJS.Timer;

    start(output: (text: string) => void, over: (user: any) => void) {
        this.output = output;
        this.over = over;

        this.drawNumbers();
    }

    handleMessage(word: string, user: any) {
        if (!this.currentDraw) return;

        const answer = parseInt(word.trim(), 10);
        if (answer === this.currentDraw.result) {
            this.output(`Congratulations ${user}!`);
            this.over(user);
        }
    }

    stop() {
        this.clearTimers();
        delete this.currentDraw;
    }

    private clearTimers() {
        clearTimeout(this.to);
        delete this.to;
    }

    private drawNumbers() {
        const numbers = [];
        const numbersNumber = random(3, 5);
        for (let i = 0; i < numbersNumber; i++) {
            numbers.push(random(100));
        }
        this.currentDraw = {
            numbers,
            result: numbers.reduce((sum, b) => sum + b)
        };

        this.output(`Solve the following:    ${numbers.join(' + ')}`);
        this.to = setTimeout(() => {
            this.timeout();
        }, DURATION);
    }

    private timeout() {
        this.output('Timeout!');
        this.over(null);
    }
}
