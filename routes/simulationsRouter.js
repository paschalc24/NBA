import express from 'express';
import fs from 'fs';
import winston from 'winston';
import mvLinearRegression from '../modules/mvLinearRegression.js';
import fileMap from '../modules/fileMap.js';
import { v4 as uuidv4 } from 'uuid';

const simulationsRouter = express.Router();

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

simulationsRouter.get('/all', async (req, res) => {
    logger.info(`Get request for all simulations`)
    try {
        const data = await fs.promises.readFile('./data/out.json', 'utf8');
        const sims = JSON.parse(data).sims;
        res.status(200).json(sims);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

simulationsRouter.get('/:id', async (req, res) => {
    logger.info(`Get request for simulation with id: ${JSON.stringify(req.params.id)}`);
    if (typeof(req?.params?.id) !== 'string') {
        res.status(400).json({error: 'Bad Request'});
    }
    else {
        try {
            const data = await fs.promises.readFile('./data/out.json', 'utf8');
            let sims = JSON.parse(data).sims;
            const id = req.params.id;
            sims = sims.filter(e => e.id === id);
            res.status(200).json(sims);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})

simulationsRouter.post('/mvLinearRegression/:team1/:team2', async (req, res) => {
    logger.info(`Get request for Monte Carlo Simulation: team1: ${req.params.team1} team2: ${req.params.team2}`);
    if (typeof(req?.params?.team1) !== 'string'
    || typeof(req?.params?.team1) !== 'string') {
        res.status(400).json({error: 'Bad Request'});
    }
    else {
        try {
            const data = await fs.promises.readFile('./data/out.json', 'utf8');
            const simsData = JSON.parse(data);
            const team1 = req.params.team1.toLowerCase();
            const team2 = req.params.team2.toLowerCase();
            const team1data = await fs.promises.readFile(fileMap[team1], 'utf8');
            const team2data = await fs.promises.readFile(fileMap[team2], 'utf8');
            const team1games = JSON.parse(team1data).rowSet;
            const team2games = JSON.parse(team2data).rowSet;
            const newSim = mvLinearRegression(team1games, team2games);
            const now = new Date().toISOString();
            const result = {id:uuidv4(),created:now,[team1]:newSim.p0,[team2]:newSim.p1};
            simsData.sims.push(result);
            await fs.promises.writeFile('./data/out.json', JSON.stringify(simsData, null, 4), 'utf8');
            res.status(200).json(result);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})

simulationsRouter.put('/:id', async (req, res) => {
    logger.info(`Put request for game with id: ${req.params.id} ${JSON.stringify(req.body)}`);
    if (typeof(req?.params?.id) !== 'string') {
        res.status(400).json({error: 'Bad Request'});
    }
    else{
        try {
            const data = await fs.promises.readFile('./data/out.json', 'utf8');
            const simsData = JSON.parse(data);
            const generatedSim = req.body;
            const simIndex = simsData.sims.findIndex(sim => sim.id === req.params.id);
            if (simIndex === -1) {
                res.status(404).json({ error: 'Simulation not found' });
            } else {
                simsData.sims[simIndex] = generatedSim;
                generatedSim.id = req.params.id;
                const now = new Date().toISOString();
                generatedSim.created = now;
                await fs.promises.writeFile('./data/out.json', JSON.stringify(simsData, null, 4), 'utf8');
                res.status(200).json(generatedSim);
            }
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

simulationsRouter.delete('/:id', async (req, res) => {
    logger.info(`Delete request for game: ${JSON.stringify(req.params.id)}`);
    if (typeof(req?.params?.id) !== 'string') {
        res.status(400).json({error: 'Bad Request'});
    }
    else{
        try {
            const data = await fs.promises.readFile('./data/out.json', 'utf8');
            const simsData = JSON.parse(data);
            const simIndex = simsData.sims.findIndex(sim => sim.id === req.params.id);
            if (simIndex === -1) {
                res.status(404).json({ error: 'Game not found' });
            } else {
                simsData.sims.splice(simIndex, 1);
                await fs.promises.writeFile('./data/out.json', JSON.stringify(simsData, null, 4), 'utf8');
                res.status(204).send();
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

export default simulationsRouter;