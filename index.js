import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import winston from 'winston';
import fs from 'fs';

// To use logger, add to endpoints:
// logger.info(`Get request for book: ${req.params.id}`);

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

app.get('/games/:teamname', async (req, res) => {
    try {
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

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port: ${port}`)
    }
    else {
        console.error(err)
    }
})