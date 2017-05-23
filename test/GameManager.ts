import { expect, use } from 'chai';
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai';

import { GameManager } from '../src/GameManager'

use(sinonChai);

describe("GameManager", function () {
    let manager: GameManager;
    let sandbox: sinon.SinonSandbox;
    let spy: sinon.SinonSpyStatic;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        spy = sandbox.spy();
        manager = new GameManager(spy, { foo: 30, bar: 20, baz: 10 });
    });
    afterEach(function () {
        manager.stop();
        sandbox.restore();
    });

    describe('#print', function () {
        it('should be overridable by a custom function', function () {
            manager.start();
            expect(spy).to.have.been.called;
        });
    });

    describe('#displayTop', function () {
        it('should print the top3', function () {
            manager.displayTop(3);
            const expected = "TOP 3\n1. foo:  30\n2. bar:  20\n3. baz:  10";
            expect(spy).to.have.been.calledWith(expected);
        });
    });
});
