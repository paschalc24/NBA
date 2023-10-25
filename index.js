import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import winston from 'winston';
import fs from 'fs';
import stats from 'statistics';

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

const app = express()
app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())

const port = process.env.PORT || 3000;

app.get('/gamesbyteam/:teamname', async (req, res) => {
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
        res.json(games)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/pointsStats/:teamname', async (req, res) => {
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
        res.send(result.reduce(stats))
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/games', async (req, res) => {
    try {
        logger.info(`Get request for all games`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        let games = JSON.parse(data).games;
        res.json(games)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/games/:id', async (req, res) => {
    try {
        logger.info(`Get request for game with id: ${req.params.id}`);
        const data = await fs.promises.readFile('./data/april2022.json', 'utf8');
        let games = JSON.parse(data).games;
        const id = parseInt(req.params.id)
        games = games.filter(e => e.id === id)
        res.json(games)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/games', async (req, res) => {
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

app.put('/games/:id', async (req, res) => {
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

app.delete('/games/:id', async (req, res) => {
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

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port: ${port}`)
    }
    else {
        console.error(err)
    }
})