import { expect } from 'chai';

import { Quizz } from '../../src/trivia/Quizz';

const QUESTIONS_FILE = '../questions/fr/database.txt';

describe("Quizz", function () {
    let quizz: Quizz;

    beforeEach(function () {
        quizz = new Quizz({ questionsFile: QUESTIONS_FILE });
    });

    describe('@loadQuestions', function () {
        it('should load the file given and an array of questions', function () {
            const questionsFile = QUESTIONS_FILE;
            const questions = Quizz.loadQuestions(questionsFile);
            expect(questions).to.be.an('array')
        });
    });
});
