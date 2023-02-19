import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import * as trie from 'trie-prefix-tree';
import * as diacritics from 'diacritics';
import { shuffle } from 'lodash';

import { AbstractGame } from '../AbstractGame';
import pickRandomLetter from './RandomLetter';

const ROOT_DIR = path.resolve(__dirname, '../');

const DURATION = 45 * 1000;
const REMINDER_INTERVAL = DURATION / 3;
const SOLUTIONS_DISPLAYED_NUMBER = 5;

export class Scrabble extends AbstractGame {
    static title = 'Scrabble';
    static rules = 'Find the longest word with given letters';

    ready = false;

    private trie = trie([]);
    private currentDraw: {
        draw: string[];
        solutions: any;
        bestSolutions: string[];
    };
    private bestAnswer: {
        user: any;
        answer: string;
    };
    private to: NodeJS.Timer;
    private reminderTo: NodeJS.Timer;

    constructor(options: { dictFile: string }) {
        super();
        this.loadDict(options.dictFile);
    }

    private loadDict(dictFile: string) {
        const filePath = path.resolve(ROOT_DIR, dictFile);

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
        });

        rl.on('line', (line) => {
            const word = diacritics.remove(line.trim());
            this.trie.addWord(word);
        });

        rl.on('close', () => {
            this.ready = true;
        });
    }

    start(output: (text: string) => void, over: (user: any) => void) {
        this.output = output;
        this.over = over;

        this.drawLetters();
    }

    handleMessage(word: string, user: any) {
        if (!this.currentDraw) return;

        const answer = word.trim();
        const isValidWord = this.currentDraw.solutions.hasWord(diacritics.remove(answer));
        if (isValidWord) {
            if (!this.bestAnswer || this.bestAnswer.answer.length < answer.length) {
                this.output(`${user} has now the best answer:   ${answer}`);
                this.bestAnswer = { user, answer };

                if (answer.length === this.currentDraw.bestSolutions[0].length) this.timeout();
            }
        }
    }

    stop() {
        this.clearTimers();
        delete this.currentDraw;
        delete this.bestAnswer;
    }

    private clearTimers() {
        clearTimeout(this.to);
        delete this.to;
        clearInterval(this.reminderTo);
        delete this.reminderTo;
    }

    private pickLetters(n = 10) {
        const letters: string[] = [];
        for (let i = 0; i < n; i++) {
            letters.push(pickRandomLetter());
        }
        return shuffle(letters);
    }

    private drawLetters() {
        const draw = this.pickLetters();
        const solutions = trie(this.trie.getSubAnagrams(draw.join('').toLowerCase()));
        const bestSolutions = solutions
            .getWords()
            .sort((a, b) => b.length - a.length)
            .slice(0, SOLUTIONS_DISPLAYED_NUMBER);

        this.currentDraw = { draw, solutions, bestSolutions };

        this.output(`Find the longest word containing the following letters: ${this.currentDraw.draw.join(', ')}`);
        this.to = setTimeout(() => {
            this.timeout();
        }, DURATION);
        this.reminderTo = setInterval(() => {
            this.output(`The current draw is: ${this.currentDraw.draw.join(', ')}`);
        }, REMINDER_INTERVAL);
    }

    private timeout() {
        this.output('Timeout!');

        if (this.bestAnswer) {
            this.output(`The best answer has been given by ${this.bestAnswer.user}! (${this.bestAnswer.answer})`);
            this.output(`Possible solutions: ${this.currentDraw.bestSolutions.join(', ')}`);
            this.over(this.bestAnswer.user);
        } else {
            this.output('Nobody found an answer! :(');
            this.output(`Possible solutions: ${this.currentDraw.bestSolutions.join(', ')}`);
            this.over(null);
        }
    }
}
