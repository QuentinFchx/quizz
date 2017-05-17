"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var diacritics = require("diacritics");
var LETTER_REGEXP = /\w/g;
var HIDE_PERCENT = 2 / 3;
var Question = (function () {
    function Question(text) {
        _a = text.split(' \\ '), this.question = _a[0], this.answer = _a[1];
        this._answer = this.prepareAnswer(this.answer);
        var _a;
    }
    Question.prototype.prepareAnswer = function (answer) {
        return diacritics.remove(answer).toLowerCase();
    };
    Question.prototype.check = function (answer) {
        return this.prepareAnswer(answer) === this._answer;
    };
    Question.prototype.hint = function (level, placeholder) {
        if (level === void 0) { level = 1; }
        if (placeholder === void 0) { placeholder = '□'; }
        switch (level) {
            case 1:
                return this._answer.replace(LETTER_REGEXP, placeholder);
            case 2:
                var answer = this._answer;
                var answerLength = (answer.match(LETTER_REGEXP) || []).length;
                var numberOfLettersToHide = Math.floor(answerLength * HIDE_PERCENT);
                while (numberOfLettersToHide) {
                    var randomIndex = Math.floor(Math.random() * answer.length);
                    if (LETTER_REGEXP.test(answer[randomIndex])) {
                        answer = answer.substr(0, randomIndex) + placeholder + answer.substr(randomIndex + 1);
                        numberOfLettersToHide -= 1;
                    }
                }
                return answer;
        }
    };
    return Question;
}());
exports.Question = Question;
