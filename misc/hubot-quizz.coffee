# Description
#   A simple quizz
#
# Dependencies:
#   "quizz": "0.0.5"
#
# Commands:
#   hubot qstart - Start the quizz
#   hubot qstop - Stop the quizz
#   hubot qscore - Print top 3
#
# Author:
#   QuentinFchx


Quizz = require('quizz')

module.exports = (robot) ->

    quizz = null

    robot.brain.on 'loaded', =>
        robot.brain.data.qscores ||= {}

    robot.respond /qstart$/i, (msg) ->
        if quizz
            msg.send "A Quizz instance is already running!"
            return
        print = (txt) ->
            msg.send txt
        quizz = new Quizz(null, robot.brain.data.qscores, print)
        quizz.start()

    robot.respond /qstop$/i, (msg) ->
        if quizz
            quizz.stop();
            quizz = null

    robot.respond /qscore$/i, (msg) ->
        if quizz then quizz.displayTop 3

    robot.hear /(.*)/i, (msg) ->
        if quizz then quizz.check(msg.match[1], msg.message.user.name)
