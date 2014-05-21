chai = require 'chai'
chai.should()

Question = require '../src/Question.coffee'


describe "Question", ->

    beforeEach ->
        @q = new Question("question? \\ answer")

    describe '#prepareAnswer', ->
        it 'should convert special characters to ASCII equivalent', ->
            q = new Question("question? \\ àñswér")
            q._answer.should.equal "answer"

    describe '#hint', ->
        it 'should return placeholders for level 1', ->
            @q.hint(1).should.equal "□□□□□□"

    describe '#check', ->
        it 'should return true if the answer is correct', ->
            @q.check("answer").should.be.true
            @q.check("Answer").should.be.true
            @q.check("àñswér").should.be.true

        it 'should return false if the answer is wrong', ->
            @q.check("answerr").should.be.false
            @q.check("onswer").should.be.false
