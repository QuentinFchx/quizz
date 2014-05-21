diacritics = require 'diacritics'

class Question

    placeholder: '□'

    constructor: (string) ->
        [@question, @answer] = string.split " \\ "
        @_answer = @prepareAnswer @answer

    prepareAnswer: (answer)->
         return diacritics.remove(answer).toLowerCase()

    check: (answer) ->
        return @_answer == @prepareAnswer answer

    hint: (level = 1)->
        switch level
            when 1
                return @_answer.replace /\w/g, @placeholder

module.exports = Question
