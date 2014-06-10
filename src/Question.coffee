diacritics = require 'diacritics'

LETTER_REGEXP = /\w/g

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
                return @_answer.replace LETTER_REGEXP, @placeholder
            when 2
                answer = @_answer
                answer_length = (answer.match LETTER_REGEXP or []).length
                number_of_letters_to_hide = Math.ceil answer_length * 2 / 3

                while number_of_letters_to_hide
                    random_index = Math.floor Math.random() * answer.length
                    if LETTER_REGEXP.test answer[random_index]
                        answer = answer.substr(0, random_index) + @placeholder + answer.substr(random_index + 1);
                        number_of_letters_to_hide -= 1
                return answer


module.exports = Question
