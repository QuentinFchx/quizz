import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import * as trie from 'trie-prefix-tree';
import * as diacritics from 'diacritics';
import { shuffle, random } from 'lodash';

import { AbstractGame } from '../AbstractGame';

const ROOT_DIR = path.resolve(__dirname, '../');

const VOWELS = 'AEIOUY';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXZ';

const DURATION = 45 * 1000;
const SOLUTIONS_DISPLAYED_NUMBER = 5;

export class Scrabble extends AbstractGame {
    static title = 'Scrabble';
    static rules = 'Find the longest word with given letters';

    private trie = trie([]);
    private currentDraw: {
        draw: string[],
        solutions: any
    };
    private bestAnswer: {
        user: any,
        answer: string
    };
    private to: NodeJS.Timer;

    constructor(options: { dictFile: string }) {
        super();
        this.loadDict(options.dictFile);
    }

    private loadDict(dictFile: string) {
        const filePath = path.resolve(ROOT_DIR, dictFile);

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        rl.on('line', (line) => {
            const word = diacritics.remove(line.trim());
            this.trie.addWord(word);
        });
    }

    start(output: (text: string) => void, over: () => void) {
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
    }

    private pickLetters(n = 10) {
        const letters = [];
        const vowelsNumber = Math.ceil(n / 3);
        [
            { set: VOWELS, n: vowelsNumber },
            { set: CONSONANTS, n: n - vowelsNumber }
        ].forEach(o => {
            for (let i = 0; i < o.n; i++) {
                letters.push(o.set[random(o.set.length - 1)]);
            }
        });
        return shuffle(letters);
    }

    private drawLetters() {
        const draw = this.pickLetters();
        const solutions = trie(this.trie.getSubAnagrams(draw.join('').toLowerCase()));
        this.currentDraw = { draw, solutions };

        this.output(`Find the longest word containing the following letters: ${this.currentDraw.draw.join(', ')}`);
        this.to = setTimeout(() => {
            this.timeout();
        }, DURATION);
    }

    private timeout() {
        this.output('Timeout!');
        const longestWords = this.currentDraw.solutions.getWords()
            .sort((a, b) => b.length - a.length)
            .slice(0, SOLUTIONS_DISPLAYED_NUMBER);

        if (this.bestAnswer) {
            this.output(`The best answer has been given by ${this.bestAnswer.user}! (${this.bestAnswer.answer})`);
            this.output(`Possible solutions: ${longestWords.join(', ')}`);
            this.over(this.bestAnswer.user);
        }
        else {
            this.output('Nobody found an answer! :(');
            this.output(`Possible solutions: ${longestWords.join(', ')}`);
            this.over(null);
        }
    }
}
