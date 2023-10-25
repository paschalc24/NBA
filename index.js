import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import gamesRouter from './routes/gameRoutes.js';

const app = express()
app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())

const port = process.env.PORT || 3000;

app.use('/games', gamesRouter)

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port: ${port}`)
    }
    else {
        console.error(err)
    }
})