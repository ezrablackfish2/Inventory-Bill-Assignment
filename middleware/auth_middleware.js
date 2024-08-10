const jwt = require('jsonwebtoken');
const jwt_secrete =  process.env.SECRET_KEY || 'mysecret';
const authMiddleware = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Please login to continue' });
    }

    const realToken = token.split(' ');


    try {
        // Verify and decode the token
        const decoded = jwt.verify(realToken[1], jwt_secrete);

        // Attach the decoded token to the request object
        req.user = decoded;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token or expired token' });
    }
};

module.exports = authMiddleware;
