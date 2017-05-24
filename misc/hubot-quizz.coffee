# Description
#   A simple quizz
#
# Dependencies:
#   "quizz": "0.0.8"
#
# Commands:
#   hubot qstart - Start the quizz
#   hubot qstop - Stop the quizz
#
# Author:
#   QuentinFchx


GameManager = require('quizz').GameManager

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
        quizz = new GameManager(print, robot.brain.data.qscores)
        quizz.start()

    robot.respond /qstop$/i, (msg) ->
        if quizz
            quizz.stop();
            quizz = null

    robot.hear /(.*)/i, (msg) ->
        if quizz then quizz.handleMessage(msg.match[1], msg.message.user.name)
