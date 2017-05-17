"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var Question_1 = require("./Question");
var MAX_UNANSWERED_QUESTIONS = 3;
var QUESTION_DELAY = 30000;
var HINT1_DELAY = 10000;
var HINT2_DELAY = 20000;
var PAUSE_DELAY = 5000;
var ROOT_DIR = path.resolve(__dirname, '../');
var Quizz = (function () {
    function Quizz(questionsFile, scores, print) {
        if (questionsFile === void 0) { questionsFile = './questions/fr/database.txt'; }
        if (scores === void 0) { scores = {}; }
        if (print === void 0) { print = function (text) { console.log(text); }; }
        this.scores = scores;
        this.print = print;
        this.unansweredQuestionsCount = 0;
        this.questions = Quizz.loadQuestions(questionsFile);
    }
    Quizz.prototype.start = function () {
        this.print('Starting Quizz...');
        this.nextQuestion();
    };
    Quizz.prototype.pickQuestion = function () {
        var randomIndex = Math.floor(Math.random() * this.questions.length);
        var question = this.questions[randomIndex];
        return new Question_1.Question(question);
    };
    Quizz.prototype.ask = function () {
        var _this = this;
        this.currentQuestion = this.pickQuestion();
        this.print(this.currentQuestion.question);
        this.qto = setTimeout(function () { return _this.timeout(); }, QUESTION_DELAY);
        this.h1to = setTimeout(function () { return _this.giveHint(1); }, HINT1_DELAY);
        this.h2to = setTimeout(function () { return _this.giveHint(2); }, HINT2_DELAY);
        this.unansweredQuestionsCount += 1;
    };
    Quizz.prototype.giveHint = function (level) {
        if (level === void 0) { level = 1; }
        this.print(this.currentQuestion.hint(level));
    };
    Quizz.prototype.check = function (answer, user) {
        this.unansweredQuestionsCount = 0;
        if (this.currentQuestion && this.currentQuestion.check(answer)) {
            this.print(user + " found the answer:   " + this.currentQuestion.answer);
            this.reward(user, 10);
            this.clearTimers();
            this.nextQuestion();
        }
    };
    Quizz.prototype.timeout = function () {
        this.print("The answer was: " + this.currentQuestion.answer);
        if (this.unansweredQuestionsCount > MAX_UNANSWERED_QUESTIONS)
            this.stop();
        else
            this.nextQuestion();
    };
    Quizz.prototype.reward = function (user, points) {
        if (!this.scores[user])
            this.scores[user] = 0;
        this.scores[user] += points;
    };
    Quizz.prototype.nextQuestion = function () {
        var _this = this;
        this.currentQuestion = null;
        this.qto = setTimeout(function () { return _this.ask(); }, PAUSE_DELAY);
    };
    Quizz.prototype.getTop = function (n) {
        var _this = this;
        return Object.keys(this.scores)
            .map(function (key) {
            return {
                user: key,
                score: _this.scores[key]
            };
        })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, n);
    };
    Quizz.prototype.displayTop = function (n) {
        if (n === void 0) { n = 3; }
        var top = this.getTop(n);
        var res = "TOP " + n;
        top.forEach(function (entry, index) {
            res += "\n" + (index + 1) + ". " + entry.user + ":  " + entry.score;
        });
        this.print(res);
    };
    Quizz.prototype.clearTimers = function () {
        clearTimeout(this.qto);
        delete this.qto;
        clearTimeout(this.h1to);
        delete this.h1to;
        clearTimeout(this.h2to);
        delete this.h2to;
    };
    Quizz.prototype.stop = function () {
        this.print('Stopping Quizz...');
        this.clearTimers();
    };
    Quizz.loadQuestions = function (filePath) {
        var _filePath = path.resolve(ROOT_DIR, filePath);
        var file = fs.readFileSync(_filePath);
        return file.toString().split('\n');
    };
    return Quizz;
}());
exports.Quizz = Quizz;
