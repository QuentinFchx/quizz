import { expect } from 'chai';

import { Question } from '../../src/trivia/Question';

describe('Question', function () {
    let question: Question;

    beforeEach(function () {
        question = new Question('question?', 'answer');
    });

    describe('#hint', function () {
        it('should return placeholders for level 1', function () {
            expect(question.hint(1)).to.equal('□□□□□□');
        });

        it('should unveil a third of the word for level 2', function () {
            const hint = question.hint(2);
            expect(hint.replace(/□/g, '').length).to.equal(2);
        });
    });

    describe('#check', function () {
        it('should return true if the answer is correct', function () {
            expect(question.check('answer')).to.be.true;
            expect(question.check('Answer')).to.be.true;
            expect(question.check('àñswér')).to.be.true;
        });

        it('should return false if the answer is wrong', function () {
            expect(question.check('foo')).to.be.false;
            expect(question.check('bar')).to.be.false;
        });
    });
});
