import jwt from 'jsonwebtoken';
import User from '../../model/user.model.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Access denied.' });
    }
    next();
  };
};
