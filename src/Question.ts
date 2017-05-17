import * as diacritics from 'diacritics';

const LETTER_REGEXP = /\w/g;
const HIDE_PERCENT = 2 / 3;

export class Question {
    question: string;
    answer: string;
    private _answer: string;

    constructor(text: string) {
        [this.question, this.answer] = text.split(' \\ ');
        this._answer = this.prepareAnswer(this.answer);
    }

    private prepareAnswer(answer: string): string {
        return diacritics.remove(answer).toLowerCase();
    }

    check(answer: string): boolean {
        return this.prepareAnswer(answer) === this._answer;
    }

    hint(level = 1, placeholder = '□'): string {
        switch (level) {
            case 1:
                return this._answer.replace(LETTER_REGEXP, placeholder);
            case 2:
                let answer = this._answer;
                const answerLength = (answer.match(LETTER_REGEXP) || []).length;

                let numberOfLettersToHide = Math.floor(answerLength * HIDE_PERCENT);
                while (numberOfLettersToHide) {
                    const randomIndex = Math.floor(Math.random() * answer.length);
                    if (LETTER_REGEXP.test(answer[randomIndex])) {
                        answer = answer.substr(0, randomIndex) + placeholder + answer.substr(randomIndex + 1);
                        numberOfLettersToHide -= 1;
                    }
                }
                return answer;
        }
    }
}
