const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req, res }, next) {
    // allows token to be sent via headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'You are not authenticated!' });
    }

    try {
      // verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      console.log('Invalid token:', error.message);
      return res.status(401).json({ message: 'Invalid token!' });
    }

    // send to next resolver
    return next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
