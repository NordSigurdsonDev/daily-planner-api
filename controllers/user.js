const mongoose = require('mongoose');
const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const ConflictError = require('../errors/ConflictError');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createUser = (req, res, next) => {
  const { login, email } = req.body;

  return bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      login,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({
      login,
      email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Ошибка валидации'));
      }

      if (err.code === 11000) {
        return next(new ConflictError('Данный email уже занят'));
      }

      return next(new ServerError('Ошибка сервер'));
    });
};

const findUserById = (req, res, next) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Некоректный id'));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь отсутствует'));
      }
      return next(new ServerError('Ошибка сервера'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
        Domain: 'http://localhost:3000',
      }).send({ token });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

module.exports = {
  createUser,
  login,
  findUserById,
};
