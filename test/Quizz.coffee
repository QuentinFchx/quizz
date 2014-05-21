chai = require 'chai'
sinon = require 'sinon'
sinonChai = require 'sinon-chai'

chai.should()
chai.use(sinonChai)

Quizz = require '../src/Quizz.coffee'


describe "Quizz", ->

    beforeEach ->
        @q = new Quizz()

    describe '@loadQuestions', ->
        it 'should load the file given and return an array of questions', ->
            questions_file = "./questions/fr/database.txt"
            questions = Quizz.loadQuestions questions_file
            Array.isArray(questions).should.be.true

    describe '#print', ->
        it 'should be overridable by a custom function', ->
            spy = sinon.spy()
            q = new Quizz null, null, spy

            q.print()
            spy.should.have.been.called

            q.print "foo"
            spy.should.have.been.calledWith "foo"

    describe '#reward', ->
        it 'should create an entry in the scores object if it does not exist', ->
            @q.reward "Paul", 10
            @q.scores["Paul"].should.exist

    describe '#getTop', ->

        beforeEach ->
            @q.reward "foo", 10
            @q.reward "bar", 40
            @q.reward "baz", 20

        it 'should return an array of the asked length', ->
            @q.getTop(1).length.should.equal 1
            @q.getTop(2).length.should.equal 2
            @q.getTop(3).length.should.equal 3

        it 'should return an ordered array', ->
            top = @q.getTop 3
            top[0].user.should.equal "bar"
            top[1].user.should.equal "baz"
            top[2].user.should.equal "foo"
