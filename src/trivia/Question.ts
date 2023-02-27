import * as diacritics from 'diacritics';
import * as levenshtein from 'js-levenshtein';

const LETTER_REGEXP = /\w/g;
const HIDE_PERCENT = 2 / 3;

export class Question {
    private _answer: string;
    private _maxLevenshtein: number;

    /**
     * @param choices a list of choices. The first choice is the correct answer
     */
    constructor(public question: string, public answer: string, public choices?: string[], public hasHints = true) {
        this._answer = this.prepareAnswer(this.answer);

        this._maxLevenshtein = Math.floor(this._answer.length / 5);
    }

    private prepareAnswer(answer: string): string {
        return (diacritics.remove(answer) as string).toLowerCase().trim().replace(/\W/g, ' ');
    }

    check(answer: string): boolean {
        // If question has choices, check if the answer provided is an index-like string and if so check the choice.
        if (this.choices) {
            const index = parseInt(answer, 10);
            if (Number.isInteger(index) && this.choices[index] === this.answer) {
                return true;
            }
        }

        const preparedAnswer = this.prepareAnswer(answer);
        return levenshtein(preparedAnswer, this._answer) <= this._maxLevenshtein;
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
