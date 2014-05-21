require 'coffee-script/register'

fs = require 'fs'
Question = require './Question'

QUESTION_DELAY = 30000
HINT1_DELAY = 15000
PAUSE_DELAY = 4000

class Quizz

    constructor: (questions_file="./questions/fr/database.txt", scores = {}) ->
        @questions = Quizz.loadQuestions questions_file
        @scores = scores

    start: ->
        @print "Starting Quizz..."
        @nextQuestion()
        return

    pickQuestion: ->
        question = @questions[Math.floor Math.random() * @questions.length]
        new Question(question)

    ask: ->
        @current_question = @pickQuestion()
        @print(@current_question.question)
        @qto = setTimeout (=> @timeout()), QUESTION_DELAY
        @h1to = setTimeout (=> @giveHint()), HINT1_DELAY
        return

    giveHint: (level=1) ->
        @print @current_question.hint(level)
        return

    check: (answer, user) ->
        if @current_question and @current_question.check(answer)
            @print "#{user} found the answer:   #{@current_question.answer}"
            @reward(user, 10)
            @current_question = null
            @clearTimers()
            @nextQuestion()
        return

    timeout: ->
        @print "The answer was: #{@current_question.answer}"
        @nextQuestion()
        return

    reward: (user, points) ->
        @scores[user] or= 0
        @scores[user] += points

    nextQuestion: ->
        @qto = setTimeout (=> @ask()), PAUSE_DELAY
        return

    getTop: (n) ->
        ({score: score, user: user} for user, score of @scores).sort((a,b)-> return a.score < b.score)[0..n-1]

    displayTop: (n) ->
        top = @getTop n
        res = "TOP #{n}"
        res += "\n#{i+1}. #{s.u}:  #{s.s}" for s, i in top
        @print res
        return

    print: (n) ->
        console.log n
        return

    clearTimers: ->
        clearTimeout @qto
        delete @qto
        clearTimeout @h1to
        delete @h1to
        return

    stop: ->
        @print "Stopping Quizz..."
        @clearTimers()
        return

    @loadQuestions: (path)->
        file = fs.readFileSync path
        file.toString().split "\n"

module.exports = Quizz
