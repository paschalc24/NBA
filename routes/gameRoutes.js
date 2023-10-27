import express from 'express';
import fs from 'fs';
import winston from 'winston';
import mvLinearRegression from '../modules/mvLinearRegression.js';
import fileMap from '../modules/fileMap.js';
import { v4 as uuidv4 } from 'uuid';

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
    logger.info(`Get request for games: ${req.params.teamname}`);
    if (typeof(req?.params?.teamname) !== 'string') {
        res.status(400).json({error: 'Bad Request'})
    }
    else{
        try {
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
    }
})

gamesRouter.get('/pointsStats/:teamname', async (req, res) => {
    logger.info(`Get request for points: ${req.params.teamname}`);
    if (typeof(req?.params?.teamname) !== 'string') {
        res.status(400).json({error: 'Bad Request'})
    }
    else{
        try {
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
    }
})

gamesRouter.post('/mvLinearRegression/:team1/:team2', async (req, res) => {
    logger.info(`Get request for Monte Carlo Simulation: team1: ${req.params.team1} team2: ${req.params.team2} numSims: ${req.params.numSims}`);
    if (typeof(req?.params?.team1) !== 'string'
    || typeof(req?.params?.team1) !== 'string') {
        res.status(400).json({error: 'Bad Request'})
    }
    else {
        try {
            const data = await fs.promises.readFile('./data/out.json', 'utf8');
            const gamesData = JSON.parse(data);
            const team1 = req.params.team1.toLowerCase()
            const team2 = req.params.team2.toLowerCase()
            const team1data = await fs.promises.readFile(fileMap[team1], 'utf8');
            const team2data = await fs.promises.readFile(fileMap[team2], 'utf8');
            const team1games = JSON.parse(team1data).rowSet
            const team2games = JSON.parse(team2data).rowSet
            const newSim = mvLinearRegression(team1games, team2games)
            const result = {id:uuidv4(),[team1]:newSim.p0,[team2]:newSim.p1}
            gamesData.sims.push(result);
            await fs.promises.writeFile('./data/out.json', JSON.stringify(gamesData, null, 4), 'utf8');
            res.status(200).json(result)
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})

gamesRouter.get('/all', async (req, res) => {
    logger.info(`Get request for all simulations`)
    try {
        const data = await fs.promises.readFile('./data/out.json', 'utf8');
        const sims = JSON.parse(data).sims;
        res.status(200).json(sims)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

gamesRouter.get('/:id', async (req, res) => {
    logger.info(`Get request for simulation with id: ${JSON.stringify(req.params.id)}`);
    if (typeof(req?.params?.id) !== 'string') {
        res.status(400).json({error: 'Bad Request'})
    }
    else {
        try {
            const data = await fs.promises.readFile('./data/out.json', 'utf8');
            let sims = JSON.parse(data).sims;
            const id = req.params.id
            sims = sims.filter(e => e.id === id)
            res.status(200).json(sims)
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
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
    if (typeof(parseInt(req?.params?.id)) !== 'number') {
        res.status(400).json({error: 'Bad Request'})
    }
    else{
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
    }
});

gamesRouter.delete('/:id', async (req, res) => {
    logger.info(`Delete request for game: ${JSON.stringify(req.params.id)}`);
    if (typeof(parseInt(req?.params?.id)) !== 'number') {
        res.status(400).json({error: 'Bad Request'})
    }
    else{
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
    }
});

export default gamesRouter;