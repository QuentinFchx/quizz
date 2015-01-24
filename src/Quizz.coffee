fs = require 'fs'
path = require 'path'
Question = require './Question'

MAX_UNANSWERED_QUESTIONS = 3
QUESTION_DELAY = 30000
HINT1_DELAY = 10000
HINT2_DELAY = 20000
PAUSE_DELAY = 5000

ROOT_DIR = path.resolve __dirname, "../"

class Quizz

    constructor: (questions_file="./questions/fr/database.txt", scores={}, print) ->
        @questions = Quizz.loadQuestions questions_file
        @scores = scores
        @unanswered_questions = 0

        if print
            @print = print
        return

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
        @h1to = setTimeout (=> @giveHint(1)), HINT1_DELAY
        @h2to = setTimeout (=> @giveHint(2)), HINT2_DELAY
        @unanswered_questions += 1
        return

    giveHint: (level=1) ->
        @print @current_question.hint(level)
        return

    check: (answer, user) ->
        @unanswered_questions = 0
        if @current_question and @current_question.check(answer)
            @print "#{user} found the answer:   #{@current_question.answer}"
            @reward(user, 10)
            @clearTimers()
            @nextQuestion()
        return

    timeout: ->
        @print "The answer was: #{@current_question.answer}"
        if @unanswered_questions > MAX_UNANSWERED_QUESTIONS
            @stop()
            return
        @nextQuestion()
        return

    reward: (user, points) ->
        @scores[user] or= 0
        @scores[user] += points

    nextQuestion: ->
        @current_question = null
        @qto = setTimeout (=> @ask()), PAUSE_DELAY
        return

    skipQuestion: ->
        @clearTimers()
        @timeout()

    getTop: (n) ->
        ({score: score, user: user} for user, score of @scores).sort((a,b)-> return a.score < b.score)[0..n-1]

    displayTop: (n) ->
        top = @getTop n
        res = "TOP #{n}"
        res += "\n#{index+1}. #{entry.user}:  #{entry.score}" for entry, index in top
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
        clearTimeout @h2to
        delete @h2to
        return

    stop: ->
        @print "Stopping Quizz..."
        @clearTimers()
        return

    @loadQuestions: (filePath)->
        _filePath = path.resolve ROOT_DIR, filePath
        file = fs.readFileSync _filePath
        file.toString().split "\n"

module.exports = Quizz
