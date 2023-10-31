const sanitizeURL = (req, res, next) => {
    // string contains only characters a-zA-Z, 0-9, '/' and '-'
    const regex = /^[a-zA-Z0-9\/\-?=]+$/;

    if (!regex.test(req.url)){
        res.status(400).json({ error: 'Bad Request.' });
    }
    else{
        next();
    }
}

export default sanitizeURL;