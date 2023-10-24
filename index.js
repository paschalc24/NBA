import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import winston from 'winston';

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

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port: ${port}`)
    }
    else {
        console.error(err)
    }
})