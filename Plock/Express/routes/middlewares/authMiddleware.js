
const jwt = require('jsonwebtoken');
/**Middleware to create Jsonwebtoken */


/** Variable with jwt fuction to create and decode userId
 * # I tried to use the same function to decode the token and get the role of 
 * the user to filter the tasks by role.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token.' });
        } else {
            // Assuming 'decoded' contains the user object with 'userId' and 'role'
            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        }
    });
};



module.exports = {verifyToken};