import { random } from 'lodash';

import { AbstractGame } from './AbstractGame';

import { Quizz } from './trivia/Quizz';
import { Scrabble } from './scrabble/Scrabble';


const MAX_GAMES_WITHOUT_ACTIVITY = 3;
const PAUSE_DELAY = 5000;
const SKIP_COST = 5;

export class GameManager {
    private games: { [key: string]: AbstractGame } = {};
    private currentGame: AbstractGame;
    private gamesWithoutActivity = 0;

    constructor(
        private output: (text: string) => void = (text: string) => { console.log(text); },
        private scores: { [key: string]: number } = {}
    ) {
        this.registerGame(Quizz.title, new Quizz({ questionsFile: '../questions/fr/database.txt' }));
        this.registerGame(Scrabble.title, new Scrabble({ dictFile: '../questions/fr/dict.txt' }));
    }

    registerGame(title: string, game: AbstractGame) {
        this.games[title] = game;
    }

    unregisterGame(title: string) {
        delete this.games[title];
    }

    start() {
        if (this.currentGame) throw new Error('Already started!');
        this.nextGame();
    }

    handleMessage(answer: string, user: any) {
        if (answer.startsWith('!')) this.handleSpecialCommand(answer.substr(1), user);
        if (this.gamesWithoutActivity) this.gamesWithoutActivity = 0;
        if (this.currentGame) this.currentGame.handleMessage(answer, user);
    }

    stop() {
        this.stopCurrentGame();
    }

    private stopCurrentGame() {
        if (this.currentGame) {
            this.currentGame.stop();
            this.currentGame = null;
        }
    }

    private pickGame() {
        const gamesList = Object.keys(this.games)
            .filter(title => this.games[title].ready);
        return this.games[gamesList[random(gamesList.length - 1)]];
    }

    private scheduleNextGame() {
        if (this.gamesWithoutActivity > MAX_GAMES_WITHOUT_ACTIVITY) {
            this.stop();
            return;
        }

        setTimeout(() => {
            this.nextGame();
        }, PAUSE_DELAY);
    }

    private nextGame() {
        const game = this.currentGame = this.pickGame();
        if (!game) {
            setTimeout(() => {
                this.nextGame();
            }, PAUSE_DELAY);
            return;
        }

        let over = false;
        game.start(this.output, (user: any) => {
            if (over) return;
            over = true;

            if (user) this.reward(user, 10);
            this.stopCurrentGame();
            this.scheduleNextGame();
        });

        this.gamesWithoutActivity += 1;
    }

    // SPECIAL COMMANDS

    private handleSpecialCommand(command: string, user: any) {
        switch (command) {
            case 'skip':
                this.skipGame(user);
                break;
            case 'score':
                this.displayTop();
                break;
        }
    }

    // SKIP GAMES

    private skipGame(user: any) {
        if (this.scores[user] < SKIP_COST) {
            this.output(`You don't have enough points (${SKIP_COST}) to skip a game`);
            return;
        }

        this.scores[user] -= SKIP_COST;
        this.output('Skipping game!');
        this.stopCurrentGame();
        this.nextGame();
    }

    // SCORES

    private reward(user: any, points: number) {
        if (!this.scores[user]) this.scores[user] = 0;
        this.scores[user] += points;
    }

    private getTop(n: number) {
        return Object.keys(this.scores)
            .map(key => {
                return {
                    user: key,
                    score: this.scores[key]
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, n);
    }

    displayTop(n: number = 3) {
        const top = this.getTop(n);
        let res = `TOP ${n}`;
        top.forEach((entry, index) => {
            res += `\n${index + 1}. ${entry.user}:  ${entry.score}`;
        });
        this.output(res);
    }
}
