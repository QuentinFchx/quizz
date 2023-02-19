import axios from 'axios';
import * as cheerio from 'cheerio';
import { Question } from '../Question';
import { Picker } from '../Trivia';

export class OpenQuizzDBPicker implements Picker {
    private client = axios.create({ baseURL: 'https://www.openquizzdb.org' });

    get ready() {
        return true;
    }

    async pickQuestion(): Promise<Question> {
        const res = await this.client.get(`ajax.php?flag=3&joueur=1&temp_qid=0&temp_bonus=0`);
        const html = res.data;
        return this.extractQuestionFromHtml(html);
    }

    private extractQuestionFromHtml(html: string): Question {
        const $ = cheerio.load(html);

        const category = $('#top_box > div:first-child').text();
        const rawQuestion = $('strong').text();
        const question = `[${category}] ${rawQuestion}`;

        const answers: { answer: string; isRightAnswer: boolean }[] = $('[id^="rep"]')
            .map((_i, elem) => {
                const elem$ = cheerio.load(elem);
                const anchor$ = elem$('a');

                const isRightAnswer = this.isOnclickRightAnswer(anchor$.attr('onclick'));

                const choice = anchor$.text().trim().substr(1).trim();

                return { answer: choice, isRightAnswer };
            })
            .get();

        const answer = answers.find((a) => a.isRightAnswer).answer;

        return new Question(question, answer);
    }

    private isOnclickRightAnswer(onclick: string): boolean {
        // AfficherReponse(challenge,bonus,joueur,numero,section,niveau,wiki)
        // AfficherReponse('0','20','1','1',4,'1','wiki')
        const re = /AfficherReponse\((.*?)\);/;
        const cbargs = re.exec(onclick)[1].split(',');
        return cbargs[3] === `'${cbargs[4]}'`;
    }
}
