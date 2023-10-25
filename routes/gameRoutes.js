import express from 'express';
import fs from 'fs';
import stats from 'statistics';
import winston from 'winston';
import monteCarlo from '../modules/monteCarlo.js';

const gamesRouter = express.Router();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'app.log'})
    ]
});

gamesRouter.get('/gamesbyteam/:teamname', async (req, res) => {
    try {
        logger.info(`Get request for games: ${req.params.teamname}`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        let games = JSON.parse(data).games;
        const teamName = req.params.teamname.toLowerCase()
        games = games.filter(e => {
                const home = e.teams.home.toLowerCase()
                const away = e.teams.away.toLowerCase()
                return home.includes(teamName) || away.includes(teamName) 
            })
        res.status(200).json(games)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

gamesRouter.get('/pointsStats/:teamname', async (req, res) => {
    try {
        logger.info(`Get request for points: ${req.params.teamname}`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        let games = JSON.parse(data).games;
        const teamName = req.params.teamname.toLowerCase()
        games = games.filter(e => {
                const home = e.teams.home.toLowerCase()
                const away = e.teams.away.toLowerCase()
                return home.includes(teamName) || away.includes(teamName) 
            })
        let result = []
        for (let game of games) {
            const home = game.teams.home.toLowerCase()
            const away = game.teams.away.toLowerCase()
            if (home.includes(teamName)) {
                result.push(game.points.home)
            }
            else if (away.includes(teamName)) {
                result.push(game.points.away)
            }
        }
        res.status(200).send(result.reduce(stats))
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

gamesRouter.get('/monteCarlo/:team1/:team2/:numSims', async (req, res) => {
    try {
        logger.info(`Get request for Monte Carlo Simulation: team1: ${req.params.team1} team2: ${req.params.team2} numSims: ${req.params.numSims}`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        const games = JSON.parse(data).games;
        const team1 = req.params.team1.toLowerCase()
        const team2 = req.params.team2.toLowerCase()
        let team1games = games.filter(e => {
                const home = e.teams.home.toLowerCase()
                const away = e.teams.away.toLowerCase()
                return home.includes(team1) || away.includes(team1) 
            })
        let team2games = games.filter(e => {
            const home = e.teams.home.toLowerCase()
            const away = e.teams.away.toLowerCase()
            return home.includes(team2) || away.includes(team2) 
        })    
        let team1points = []
        let team2points = []
        for (let game of team1games) {
            const home = game.teams.home.toLowerCase()
            const away = game.teams.away.toLowerCase()
            if (home.includes(team1)) {
                team1points.push(game.points.home)
            }
            else if (away.includes(team1)) {
                team1points.push(game.points.away)
            }
        }
        for (let game of team2games) {
            const home = game.teams.home.toLowerCase()
            const away = game.teams.away.toLowerCase()
            if (home.includes(team2)) {
                team2points.push(game.points.home)
            }
            else if (away.includes(team2)) {
                team2points.push(game.points.away)
            }
        }
        const team1stats = team1points.reduce(stats)
        const team2stats = team2points.reduce(stats)
        res.status(200).json(monteCarlo({mean: team1stats.mean, stdev:team1stats.stdev}, {mean: team2stats.mean, stdev:team2stats.stdev}, parseInt(req.params.numSims)))
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

gamesRouter.get('/all', async (req, res) => {
    try {
        logger.info(`Get request for all games`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        console.log('here')
        let games = JSON.parse(data).games;
        res.status(200).json(games)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

gamesRouter.get('/:id', async (req, res) => {
    try {
        logger.info(`Get request for game with id: ${req.params.id}`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        let games = JSON.parse(data).games;
        const id = parseInt(req.params.id)
        games = games.filter(e => e.id === id)
        res.status(200).json(games)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

gamesRouter.post('/', async (req, res) => {
    logger.info(`Post request for game: ${JSON.stringify(req.body)}`);
    try {
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        const gamesData = JSON.parse(data);
        let games = gamesData.games
        let newGame = req.body;
        if (!newGame.teams || 
            !newGame.points || 
            !newGame.totalScore) {
                res.status(400).json({ error: 'Bad Request' });
        }
        newGame.id = games[games.length-1].id + 1;
        gamesData.games.push(newGame);
        await fs.promises.writeFile('./data/april2022.json', JSON.stringify(gamesData, null, 4), 'utf8');
        res.status(201).json(newGame);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

gamesRouter.put('/:id', async (req, res) => {
    logger.info(`Put request for game with id: ${req.params.id} ${JSON.stringify(req.body)}`);
    try {
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        const gamesData = JSON.parse(data);
        const updatedGame = req.body;
        const gameIndex = gamesData.games.findIndex(game => game.id === parseInt(req.params.id));
        if (gameIndex === -1) {
            res.status(404).json({ error: 'Game not found' });
        } else {
            gamesData.games[gameIndex] = updatedGame;
            await fs.promises.writeFile('./data/april2022.json', JSON.stringify(gamesData, null, 4), 'utf8');
            res.status(200).json(updatedGame);
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

gamesRouter.delete('/:id', async (req, res) => {
    logger.info(`Delete request for game: ${JSON.stringify(req.params.id)}`);
    try {
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        const gamesData = JSON.parse(data);
        const gameIndex = gamesData.games.findIndex(game => game.id === parseInt(req.params.id));
        if (gameIndex === -1) {
            res.status(404).json({ error: 'Game not found' });
        } else {
            gamesData.games.splice(gameIndex, 1);
            await fs.promises.writeFile('./data/april2022.json', JSON.stringify(gamesData, null, 4), 'utf8');
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default gamesRouter;