import 'dotenv/config';

const authenticationMiddleware = (req, res, next) => {
    const apiKey = req.headers['apikey'];
    if (process.env.API_KEY === apiKey) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized. Invalid API key.' });
    }
}
  
export default authenticationMiddleware;