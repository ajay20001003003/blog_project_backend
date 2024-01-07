const jwt = require('jsonwebtoken');


const userAuth = async (req, res, next) => {

    const token = req.header('Authorization');

    if (!token) {
        res.status(401).send({ error: "please authentication using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = data.user;
        next();
    } catch (ex) {

        res.status(401).send({ error: "please authentication using a valid token" });

    }

}





module.exports = userAuth;