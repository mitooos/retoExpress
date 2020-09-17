const Joi = require("joi");

const messageSchema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string().pattern(new RegExp("^[a-zA-Z]+ [a-zA-Z]+")).required(),
  ts: Joi.number().integer(),
});

const validateMessage = (message) => {
  let { error } = messageSchema.validate(message);
  return error ? error.message : undefined;
};

module.exports.Message = messageSchema;
module.exports.validateMessage = validateMessage;
