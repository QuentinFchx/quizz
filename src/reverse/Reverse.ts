import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import * as diacritics from 'diacritics';
import { random } from 'lodash';

import { AbstractGame } from '../AbstractGame';

const ROOT_DIR = path.resolve(__dirname, '../');

const DURATION = 15 * 1000;
const MIN_WORD_LENGTH = 5;

export class Reverse extends AbstractGame {
    static title = 'Reverse';
    static rules = 'Reverse the word as fast as possible!';

    ready = false;

    private words: string[] = [];
    private currentWord: string;
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
            if (word.length >= MIN_WORD_LENGTH) this.words.push(word);
        });

        rl.on('close', () => {
            this.ready = true;
        });
    }

    start(output: (text: string) => void, over: (user: any) => void) {
        this.output = output;
        this.over = over;

        this.drawWord();
    }

    handleMessage(word: string, user: any) {
        if (!this.currentWord) return;

        const answer = word.trim();
        const reversedWord = this.currentWord.split('').reverse().join('');
        if (answer === reversedWord) {
            this.output(`Congratulations ${user}!`);
            this.over(user);
        }
    }

    stop() {
        this.clearTimers();
        delete this.currentWord;
    }

    private clearTimers() {
        clearTimeout(this.to);
        delete this.to;
    }

    private drawWord() {
        this.currentWord = this.words[random(this.words.length - 1)];

        this.output(`Reverse the following word:    ${this.currentWord}`);
        this.to = setTimeout(() => {
            this.timeout();
        }, DURATION);
    }

    private timeout() {
        this.output('Timeout!');
        this.over(null);
    }
}
