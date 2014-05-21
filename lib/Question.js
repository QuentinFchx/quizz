// Generated by CoffeeScript 1.7.1
var Question, diacritics;

diacritics = require('diacritics');

Question = (function() {
  Question.prototype.placeholder = '□';

  function Question(string) {
    var _ref;
    _ref = string.split(" \\ "), this.question = _ref[0], this.answer = _ref[1];
    this._answer = this.prepareAnswer(this.answer);
  }

  Question.prototype.prepareAnswer = function(answer) {
    return diacritics.remove(answer).toLowerCase();
  };

  Question.prototype.check = function(answer) {
    return this._answer === this.prepareAnswer(answer);
  };

  Question.prototype.hint = function(level) {
    if (level == null) {
      level = 1;
    }
    switch (level) {
      case 1:
        return this._answer.replace(/\w/g, this.placeholder);
    }
  };

  return Question;

})();

module.exports = Question;