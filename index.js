import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import simulationsRouter from './routes/simulationsRouter.js';
import authenticationMiddleware from './modules/authentication.js';
import sanitizeURL from './modules/sanitizeURL.js';

const app = express()
app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())
app.use(authenticationMiddleware)
app.use(sanitizeURL)

const port = process.env.PORT || 3000;

app.use('/simulations', simulationsRouter)

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port: ${port}`)
    }
    else {
        console.error(err)
    }
})