const Joi = require("joi");

const registerLearnerSchema = Joi.object({
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  username: Joi.string().max(50).required(),
  school: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).required(),
});

const loginLearnerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerLearnerSchema,
  loginLearnerSchema,
};
