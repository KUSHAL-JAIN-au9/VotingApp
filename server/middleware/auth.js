const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.headers['authorization']) {
    const token = req.headers['authorization'].split(' ')[1];
    console.log("token veryfy"+token);
    jwt.verify(token, 'ThisIsATemporarySecretKey', (err, decoded) => {
      if (err) {
        console.log(err);
        // res.json({
        //   success: false,
        //   message: 'Failed to authenticate token',
        // });
        next(Error('Failed to authenticate token'));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // res.status(403).json({
    //   status: false,
    //   message: 'No token provided',
    // });

    next(Error('No token provided'));
  }
};
