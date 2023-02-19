import { expect } from 'chai';

import { FilePicker } from '../../../src/trivia/pickers/FilePicker';

const QUESTIONS_FILE = '../questions/fr/database.txt';

describe('FilePicker', function () {
    let filePicker: FilePicker;

    beforeEach(function () {
        filePicker = new FilePicker(QUESTIONS_FILE);
    });

    describe('@pickQuestion', function () {
        it('should return a question', function () {
            // TODO
        });
    });
});
