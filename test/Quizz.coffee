chai = require 'chai'
chai.should()

Quizz = require '../src/Quizz.coffee'


describe "Quizz", ->

    beforeEach ->
        @q = new Quizz()

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
