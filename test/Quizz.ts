import { Quizz } from '../src/Quizz';
import { expect, use } from 'chai';
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai';

use(sinonChai);

describe("Quizz", function () {
    let quizz: Quizz;
    let sandbox: sinon.SinonSandbox;
    let spy: sinon.SinonSpyStatic;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        spy = sandbox.spy();
        quizz = new Quizz(undefined, { foo: 30, bar: 20, baz: 10 }, spy);
    });
    afterEach(function () {
        quizz.stop();
        sandbox.restore();
    });

    describe('@loadQuestions', function () {
        it('should load the file given and an array of questions', function () {
            const questionsFile = "./questions/fr/database.txt";
            const questions = Quizz.loadQuestions(questionsFile);
            expect(questions).to.be.an('array')
        });
    });

    describe('#print', function () {
        it('should be overridable by a custom function', function () {
            quizz.start();
            expect(spy).to.have.been.called;
        });
    });

    describe('#displayTop', function () {
        it('should print the top3', function () {
            quizz.displayTop(3);
            const expected = "TOP 3\n1. foo:  30\n2. bar:  20\n3. baz:  10";
            expect(spy).to.have.been.calledWith(expected);
        });
    });
});
